import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapReturn, type DbReturn } from '../lib/supabaseMappers'
import type { ReturnRequest, ReturnStatus } from '../types/return'
import { getSupabaseForAdminData } from './adminDataClient'

let returnsCache: ReturnRequest[] | null = null

export function clearReturnsCache(): void {
  returnsCache = null
}

function sortReturnsNewest(a: ReturnRequest, b: ReturnRequest): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

async function fetchRemoteReturnsByEmail(email: string): Promise<ReturnRequest[]> {
  const normalized = email.toLowerCase()
  const client = getSupabase()

  const { data: rpcData, error: rpcError } = await client.rpc('get_returns_by_email', {
    lookup_email: normalized,
  })
  if (!rpcError && rpcData) {
    return (rpcData as DbReturn[]).map(mapReturn)
  }

  const { data, error } = await client
    .from('returns')
    .select('id, order_id, user_email, reason, status, status_updated_at, created_at')
    .eq('user_email', normalized)
    .order('created_at', { ascending: false })

  return error || !data ? [] : (data as DbReturn[]).map(mapReturn)
}

async function fetchRemoteReturnByOrderId(orderId: string): Promise<ReturnRequest | undefined> {
  const client = getSupabase()

  const { data: rpcData, error: rpcError } = await client.rpc('get_return_by_order_id', {
    lookup_order_id: orderId,
  })
  if (!rpcError && rpcData?.length) {
    return mapReturn((rpcData as DbReturn[])[0])
  }

  const { data, error } = await client
    .from('returns')
    .select('id, order_id, user_email, reason, status, status_updated_at, created_at')
    .eq('order_id', orderId)
    .maybeSingle()

  return error || !data ? undefined : mapReturn(data as DbReturn)
}

export async function loadReturns(): Promise<ReturnRequest[]> {
  if (!isSupabaseConfigured()) {
    returnsCache = []
    return []
  }

  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient
      .from('returns')
      .select('id, order_id, user_email, reason, status, status_updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    returnsCache = data ? (data as DbReturn[]).map(mapReturn) : []
    return returnsCache
  }

  returnsCache = []
  return []
}

export function getReturns(): ReturnRequest[] {
  return returnsCache ?? []
}

export async function fetchReturnsByEmail(email: string): Promise<ReturnRequest[]> {
  if (!isSupabaseConfigured()) return []

  const normalized = email.toLowerCase()

  const remoteByEmail = await fetchRemoteReturnsByEmail(normalized)

  const byId = new Map<string, ReturnRequest>()
  for (const item of remoteByEmail) {
    byId.set(item.id, item)
  }
  return [...byId.values()].sort(sortReturnsNewest)
}

export async function fetchReturnByOrderId(
  orderId: string,
  email: string,
): Promise<ReturnRequest | undefined> {
  if (!isSupabaseConfigured()) return undefined
  const returnReq = await fetchRemoteReturnByOrderId(orderId)
  if (returnReq && returnReq.email === email.toLowerCase()) {
    return returnReq
  }
  return undefined
}

export async function createReturnRequest(params: {
  orderId: string
  email: string
  reason: string
}): Promise<ReturnRequest | null> {
  const existing = await fetchReturnByOrderId(params.orderId, params.email)
  if (existing) return null

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const request: ReturnRequest = {
    id,
    orderId: params.orderId,
    email: params.email.toLowerCase(),
    reason: params.reason,
    status: 'requested',
    createdAt,
  }

  const { error } = await getSupabase()
    .from('returns')
    .insert({
      id,
      order_id: params.orderId,
      user_email: params.email.toLowerCase(),
      reason: params.reason,
      status: 'requested',
      created_at: createdAt,
    })

  if (error) {
    const duplicate = await fetchReturnByOrderId(params.orderId, params.email)
    return duplicate ?? null
  }

  returnsCache = [request, ...(returnsCache ?? [])]
  return request
}

export async function updateReturnStatus(id: string, status: ReturnStatus): Promise<boolean> {
  const found = getReturns().find((r) => r.id === id)
  if (!found) return false

  if (!isSupabaseConfigured()) return false

  const updatedAt = new Date().toISOString()
  const updated = { ...found, status, statusUpdatedAt: updatedAt }

  const adminClient = await getSupabaseForAdminData()
  const client = adminClient ?? getSupabase()
  const { error } = await client
    .from('returns')
    .update({ status, status_updated_at: updatedAt })
    .eq('id', id)

  if (error) return false
  returnsCache = (returnsCache ?? []).map((r) => (r.id === id ? updated : r))
  return true
}
