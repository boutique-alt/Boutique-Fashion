import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  buildOrderEmail,
  buildReturnEmail,
  getRecipientEmail,
  type EmailContent,
} from './templates.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-webhook-secret',
}

type TableName = 'returns' | 'orders'
type DbEvent = 'INSERT' | 'UPDATE'

interface InvokePayload {
  table: TableName
  record: Record<string, unknown>
  old_record?: Record<string, unknown> | null
  event?: DbEvent
}

function getEnv(name: string, fallback = ''): string {
  return (Deno.env.get(name) ?? fallback).trim().replace(/^["']|["']$/g, '')
}

function getSiteUrl(): string {
  let url = getEnv('SITE_URL', 'http://localhost:5173')
  if (!/^https?:\/\//i.test(url)) url = `http://${url}`
  return url.replace(/\/$/, '')
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function normalizePayload(raw: Record<string, unknown>): InvokePayload | null {
  if (raw.table === 'returns' || raw.table === 'orders') {
    const record = raw.record
    if (record && typeof record === 'object') {
      return {
        table: raw.table,
        record: record as Record<string, unknown>,
        old_record: (raw.old_record as Record<string, unknown> | null) ?? null,
        event: (raw.event as DbEvent) ?? (raw.type as DbEvent) ?? 'UPDATE',
      }
    }
  }
  return null
}

function shouldSkipUpdate(
  table: TableName,
  record: Record<string, unknown>,
  oldRecord: Record<string, unknown> | null | undefined,
  event: DbEvent,
): boolean {
  if (event === 'INSERT') return false
  const nextStatus = record.status
  const prevStatus = oldRecord?.status
  return Boolean(prevStatus && nextStatus === prevStatus)
}

async function isAuthorized(
  req: Request,
  record: Record<string, unknown>,
): Promise<boolean> {
  const webhookSecret = Deno.env.get('EMAIL_WEBHOOK_SECRET')
  if (webhookSecret && req.headers.get('x-webhook-secret') === webhookSecret) {
    return true
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return false

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: { user }, error } = await supabaseClient.auth.getUser()
  if (error || !user?.email) return false

  const recordEmail = getRecipientEmail(record)
  if (recordEmail && recordEmail === user.email.toLowerCase()) return true

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data: adminRow } = await adminClient
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  return Boolean(adminRow)
}

async function enrichOrderItemImages(
  record: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const order = (record.order as Record<string, unknown> | undefined) ?? record
  if (!Array.isArray(order.items)) return record

  const items = order.items as Record<string, unknown>[]
  const slugsNeedingImage = [
    ...new Set(
      items
        .filter((item) => {
          const image = String(item.image ?? '')
          return (!image || image.startsWith('data:')) && item.slug
        })
        .map((item) => String(item.slug)),
    ),
  ]

  if (!slugsNeedingImage.length) return record

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data: products } = await adminClient
    .from('products')
    .select('slug, image')
    .in('slug', slugsNeedingImage)

  if (!products?.length) return record

  const imageBySlug = Object.fromEntries(
    products.map((product) => [product.slug, product.image]),
  )

  const enrichedItems = items.map((item) => {
    const image = String(item.image ?? '')
    if (image && !image.startsWith('data:')) return item

    const slug = String(item.slug ?? '')
    const fallbackImage = slug ? imageBySlug[slug] : undefined
    return fallbackImage ? { ...item, image: fallbackImage } : item
  })

  const enrichedOrder = { ...order, items: enrichedItems }
  return record.order ? { ...record, order: enrichedOrder } : enrichedOrder
}

async function enrichRecord(
  table: TableName,
  record: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  let enriched = record

  if (table === 'returns' && !record.order) {
    const orderId = record.order_id
    if (orderId && typeof orderId === 'string') {
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      const { data } = await adminClient
        .from('orders')
        .select('id, items, billing, subtotal, shipping, total, payment_method, payment_status')
        .eq('id', orderId)
        .maybeSingle()

      enriched = data ? { ...record, order: data } : record
    }
  }

  return enrichOrderItemImages(enriched)
}

function resolveEmailContent(
  table: TableName,
  record: Record<string, unknown>,
  event: DbEvent,
  siteUrl: string,
): EmailContent | null {
  const status = String(record.status ?? '')
  if (table === 'orders') return buildOrderEmail(status, record, siteUrl, event)
  if (table === 'returns') return buildReturnEmail(status, record, siteUrl)
  return null
}

async function sendViaResend(to: string, content: EmailContent): Promise<string[]> {
  const apiKey = getEnv('RESEND_API_KEY')
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const from = getEnv('EMAIL_FROM', 'Boutique Fashion <orders@boutiquefashion.shop>')
  const replyTo = getEnv('REPLY_TO_EMAIL', 'theboutiquesarees@gmail.com')
  const adminNotify = getEnv('ADMIN_NOTIFY_EMAIL', 'theboutiquesarees@gmail.com').toLowerCase()
  const bcc = adminNotify && adminNotify !== to.toLowerCase() ? [adminNotify] : undefined

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      reply_to: replyTo,
      to: [to],
      ...(bcc ? { bcc } : {}),
      subject: content.subject,
      html: content.html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || 'Resend API request failed')
  }

  return bcc ?? []
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const raw = await req.json()
    const payload = normalizePayload(raw)
    if (!payload) {
      return jsonResponse({ error: 'Invalid payload' }, 400)
    }

    const { table, record: rawRecord, old_record, event = 'UPDATE' } = payload
    const record = await enrichRecord(table, rawRecord)

    if (shouldSkipUpdate(table, record, old_record, event)) {
      return jsonResponse({ skipped: true, reason: 'status_unchanged' })
    }

    const authorized = await isAuthorized(req, record)
    if (!authorized) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const siteUrl = getSiteUrl()
    const content = resolveEmailContent(table, record, event, siteUrl)
    if (!content) {
      return jsonResponse({ skipped: true, reason: 'no_template' })
    }

    const to = getRecipientEmail(record)
    if (!to) {
      return jsonResponse({ error: 'Recipient email missing' }, 400)
    }

    const bcc = await sendViaResend(to, content)
    return jsonResponse({ sent: true, to, bcc, subject: content.subject })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 400)
  }
})
