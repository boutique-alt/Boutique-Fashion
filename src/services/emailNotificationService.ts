import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { isAdminLoggedIn } from './adminService'
import type { SupabaseClient } from '@supabase/supabase-js'

type StatusTable = 'returns' | 'orders'

function toDbRecord(
  table: StatusTable,
  data: object,
): Record<string, unknown> {
  const record = data as Record<string, unknown>
  if (table === 'returns') {
    return {
      id: record.id,
      order_id: record.orderId ?? record.order_id,
      user_email: record.email ?? record.user_email,
      reason: record.reason,
      status: record.status,
      created_at: record.createdAt ?? record.created_at,
      status_updated_at: record.statusUpdatedAt ?? record.status_updated_at,
    }
  }

  const billing = record.billing as { email?: string } | undefined
  return {
    id: record.id,
    user_email: record.user_email ?? billing?.email,
    status: record.status,
    items: record.items,
    billing: record.billing,
    subtotal: record.subtotal,
    shipping: record.shipping,
    total: record.total,
    payment_method: record.payment_method,
    payment_status: record.payment_status,
    created_at: record.createdAt ?? record.created_at,
    status_updated_at: record.statusUpdatedAt ?? record.status_updated_at,
  }
}

async function resolveInvokeClient(): Promise<SupabaseClient> {
  if (isAdminLoggedIn()) {
    const admin = getSupabaseAdmin()
    const { data: { session } } = await admin.auth.getSession()
    if (session) return admin
  }
  return getSupabase()
}

async function sendStatusEmail(params: {
  table: StatusTable
  record: object
  oldRecord?: object | null
  event?: 'INSERT' | 'UPDATE'
}): Promise<void> {
  const client = await resolveInvokeClient()
  const record = toDbRecord(params.table, params.record)
  const oldRecord = params.oldRecord ? toDbRecord(params.table, params.oldRecord) : null

  const { data, error } = await client.functions.invoke('send-status-email', {
    body: {
      table: params.table,
      record,
      old_record: oldRecord,
      event: params.event ?? 'UPDATE',
    },
  })

  if (error) {
    const context = (error as { context?: Response }).context
    if (context) {
      try {
        const body = await context.json() as { error?: string }
        if (body.error) throw new Error(body.error)
      } catch (parseError) {
        if (parseError instanceof Error && parseError.message !== error.message) {
          throw parseError
        }
      }
    }
    throw error
  }

  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error))
  }
}

export function notifyStatusEmail(params: {
  table: StatusTable
  record: object
  oldRecord?: object | null
  event?: 'INSERT' | 'UPDATE'
}): void {
  if (!isSupabaseConfigured()) return
  void sendStatusEmail(params).catch((error) => {
    if (import.meta.env.DEV) {
      console.warn('[email] status notification failed:', error)
    }
  })
}
