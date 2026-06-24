import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapReturn, type DbReturn } from '../lib/supabaseMappers'
import type { ReturnRequest, ReturnStatus } from '../types/return'
import { getSupabaseForAdminData } from './adminDataClient'
import { fetchOrdersByEmail, getOrdersByEmail } from './orderService'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'returns'

let returnsCache: ReturnRequest[] | null = null

function getReturnsLocal(): ReturnRequest[] {
  return loadStore<ReturnRequest[]>(KEY, [])
}

function saveReturnLocal(request: ReturnRequest): void {
  const returns = getReturnsLocal().filter((r) => r.id !== request.id)
  saveStore(KEY, [request, ...returns])
}

function syncReturnsLocal(returns: ReturnRequest[]): void {
  saveStore(KEY, returns)
}

function sortReturnsNewest(a: ReturnRequest, b: ReturnRequest): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function returnFreshness(request: ReturnRequest): number {
  return new Date(request.statusUpdatedAt ?? request.createdAt).getTime()
}

function mergeReturnsById(remote: ReturnRequest[], local: ReturnRequest[]): ReturnRequest[] {
  const map = new Map<string, ReturnRequest>()
  for (const item of [...local, ...remote]) {
    const existing = map.get(item.id)
    if (!existing || returnFreshness(item) >= returnFreshness(existing)) {
      map.set(item.id, item)
    }
  }
  return [...map.values()].sort(sortReturnsNewest)
}

function findReturnLocalByOrderId(orderId: string): ReturnRequest | undefined {
  return getReturnsLocal().find((r) => r.orderId === orderId)
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
    .select('*')
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
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  return error || !data ? undefined : mapReturn(data as DbReturn)
}

export async function loadReturns(): Promise<ReturnRequest[]> {
  const local = getReturnsLocal()

  if (!isSupabaseConfigured()) {
    returnsCache = local
    return local
  }

  let remote: ReturnRequest[] = []
  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient
      .from('returns')
      .select('*')
      .order('created_at', { ascending: false })
    remote = data ? (data as DbReturn[]).map(mapReturn) : []
  }

  returnsCache = mergeReturnsById(remote, local)
  syncReturnsLocal(returnsCache)
  return returnsCache
}

export function getReturns(): ReturnRequest[] {
  if (returnsCache) return returnsCache
  return getReturnsLocal()
}

export function getReturnsByEmail(email: string): ReturnRequest[] {
  const normalized = email.toLowerCase()
  const orderIds = new Set(getOrdersByEmail(normalized).map((order) => order.id))
  return getReturnsLocal().filter(
    (request) =>
      request.email.toLowerCase() === normalized || orderIds.has(request.orderId),
  )
}

export async function fetchReturnsByEmail(email: string): Promise<ReturnRequest[]> {
  if (!isSupabaseConfigured()) return getReturnsByEmail(email)

  const normalized = email.toLowerCase()
  const orders = await fetchOrdersByEmail(normalized)
  const orderIds = new Set(orders.map((order) => order.id))

  const remoteByEmail = await fetchRemoteReturnsByEmail(normalized)
  const remoteByOrders: ReturnRequest[] = []
  for (const orderId of orderIds) {
    const request = await fetchRemoteReturnByOrderId(orderId)
    if (request) remoteByOrders.push(request)
  }

  const local = getReturnsLocal().filter(
    (request) =>
      request.email.toLowerCase() === normalized || orderIds.has(request.orderId),
  )
  const merged = mergeReturnsById([...remoteByEmail, ...remoteByOrders], local)

  const others = getReturnsLocal().filter(
    (request) =>
      request.email.toLowerCase() !== normalized && !orderIds.has(request.orderId),
  )
  syncReturnsLocal([...merged, ...others])
  returnsCache = [...merged, ...others]

  return merged
}

export function getReturnByOrderId(orderId: string): ReturnRequest | undefined {
  return getReturns().find((r) => r.orderId === orderId) ?? findReturnLocalByOrderId(orderId)
}

export async function fetchReturnByOrderId(
  orderId: string,
  _email: string,
): Promise<ReturnRequest | undefined> {
  const local = findReturnLocalByOrderId(orderId)
  if (!isSupabaseConfigured()) return local

  const remote = await fetchRemoteReturnByOrderId(orderId)
  if (!remote) return local

  const merged = local
    ? returnFreshness(remote) >= returnFreshness(local) ? remote : local
    : remote

  saveReturnLocal(merged)
  returnsCache = mergeReturnsById([merged], returnsCache ?? getReturnsLocal())
  return merged
}

export async function createReturnRequest(params: {
  orderId: string
  email: string
  reason: string
}): Promise<ReturnRequest | null> {
  const existing = await fetchReturnByOrderId(params.orderId, params.email)
  if (existing) return null

  const id = isSupabaseConfigured() ? crypto.randomUUID() : createId()
  const createdAt = new Date().toISOString()
  const request: ReturnRequest = {
    id,
    orderId: params.orderId,
    email: params.email.toLowerCase(),
    reason: params.reason,
    status: 'requested',
    createdAt,
  }

  if (!isSupabaseConfigured()) {
    saveReturnLocal(request)
    returnsCache = [request, ...(returnsCache ?? getReturnsLocal())]
    return request
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

  saveReturnLocal(request)
  returnsCache = [request, ...(returnsCache ?? getReturnsLocal())]
  return request
}

export async function updateReturnStatus(id: string, status: ReturnStatus): Promise<boolean> {
  const found = getReturns().find((r) => r.id === id)
  if (!found) return false

  const updatedAt = new Date().toISOString()
  const updated = { ...found, status, statusUpdatedAt: updatedAt }

  if (!isSupabaseConfigured()) {
    const next = getReturnsLocal().map((r) => (r.id === id ? updated : r))
    saveStore(KEY, next)
    returnsCache = next
    return true
  }

  const adminClient = await getSupabaseForAdminData()
  const client = adminClient ?? getSupabase()
  const { error } = await client
    .from('returns')
    .update({ status, status_updated_at: updatedAt })
    .eq('id', id)

  saveReturnLocal(updated)
  returnsCache = (returnsCache ?? getReturnsLocal()).map((r) => (r.id === id ? updated : r))
  return !error
}
