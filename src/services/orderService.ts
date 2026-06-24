import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapOrder, type DbOrder } from '../lib/supabaseMappers'
import type { Order, OrderBilling, PaymentMethod, PaymentStatus } from '../types/order'
import { isOrderStatusLocked } from '../types/order'
import type { CartItem } from '../context/StoreContext'
import { getSupabaseForAdminData } from './adminDataClient'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'orders'
const ORDER_IDS_PREFIX = 'order-ids'
const SESSION_ORDER_IDS_KEY = 'session-order-ids'

let ordersCache: Order[] | null = null

function trackSessionOrder(orderId: string): void {
  const ids = loadStore<string[]>(SESSION_ORDER_IDS_KEY, [])
  if (!ids.includes(orderId)) {
    saveStore(SESSION_ORDER_IDS_KEY, [orderId, ...ids])
  }
}

function getSessionOrderIds(): string[] {
  return loadStore<string[]>(SESSION_ORDER_IDS_KEY, [])
}

function orderIdsKey(email: string): string {
  return `${ORDER_IDS_PREFIX}-${email.toLowerCase()}`
}

function linkOrderToAccount(email: string, orderId: string): void {
  const key = orderIdsKey(email)
  const ids = loadStore<string[]>(key, [])
  if (!ids.includes(orderId)) {
    saveStore(key, [orderId, ...ids])
  }
}

function getAccountOrderIds(email: string): string[] {
  return loadStore<string[]>(orderIdsKey(email), [])
}

function orderBelongsToEmail(order: Order, email: string): boolean {
  const normalized = email.toLowerCase()
  return order.billing.email.toLowerCase() === normalized
}

function getOrdersLocal(): Order[] {
  return loadStore<Order[]>(KEY, [])
}

function saveOrderLocal(order: Order): void {
  const orders = getOrdersLocal().filter((o) => o.id !== order.id)
  saveStore(KEY, [order, ...orders])
}

function sortOrdersNewest(a: Order, b: Order): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function orderFreshness(order: Order): number {
  return new Date(order.statusUpdatedAt ?? order.createdAt).getTime()
}

function mergeOrdersById(remote: Order[], local: Order[]): Order[] {
  const map = new Map<string, Order>()
  for (const item of [...local, ...remote]) {
    const existing = map.get(item.id)
    if (!existing || orderFreshness(item) >= orderFreshness(existing)) {
      map.set(item.id, item)
    }
  }
  return [...map.values()].sort(sortOrdersNewest)
}

function syncOrdersLocal(orders: Order[]): void {
  saveStore(KEY, orders)
}

async function fetchRemoteOrdersByEmail(email: string): Promise<Order[]> {
  const normalized = email.toLowerCase()
  const client = getSupabase()
  const byId = new Map<string, Order>()

  const orderIds = getAccountOrderIds(normalized).filter((id) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id),
  )

  if (orderIds.length > 0) {
    const { data: idData, error: idError } = await client.rpc('get_orders_by_ids', {
      order_ids: orderIds,
    })
    if (!idError && idData) {
      for (const row of idData as DbOrder[]) {
        byId.set(row.id, mapOrder(row))
      }
    }
  }

  const { data: rpcData, error: rpcError } = await client.rpc('get_orders_by_email', {
    lookup_email: normalized,
  })
  if (!rpcError && rpcData) {
    for (const row of rpcData as DbOrder[]) {
      byId.set(row.id, mapOrder(row))
    }
    return [...byId.values()].sort(sortOrdersNewest)
  }

  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('user_email', normalized)
    .order('created_at', { ascending: false })

  if (!error && data) {
    for (const row of data as DbOrder[]) {
      byId.set(row.id, mapOrder(row))
    }
  }

  return [...byId.values()].sort(sortOrdersNewest)
}

export async function loadOrders(): Promise<Order[]> {
  const local = getOrdersLocal()

  if (!isSupabaseConfigured()) {
    ordersCache = local
    return local
  }

  let remote: Order[] = []

  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    remote = data ? (data as DbOrder[]).map(mapOrder) : []
  } else {
    const { data: { session } } = await getSupabase().auth.getSession()
    const email = session?.user?.email
    if (email) {
      const { data } = await getSupabase()
        .from('orders')
        .select('*')
        .eq('user_email', email.toLowerCase())
        .order('created_at', { ascending: false })
      remote = data ? (data as DbOrder[]).map(mapOrder) : []
    }
  }

  ordersCache = mergeOrdersById(remote, local)
  syncOrdersLocal(ordersCache)
  return ordersCache
}

export function getOrders(): Order[] {
  if (ordersCache) return ordersCache
  return getOrdersLocal()
}

export function getOrdersByEmail(email: string): Order[] {
  return getOrdersLocal().filter((o) => orderBelongsToEmail(o, email))
}

export async function fetchOrdersByEmail(email: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return getOrdersByEmail(email)

  const normalized = email.toLowerCase()
  const linkedIds = getAccountOrderIds(normalized)
  const sessionIds = getSessionOrderIds()
  for (const id of sessionIds) {
    linkOrderToAccount(normalized, id)
  }

  const remote = await fetchRemoteOrdersByEmail(normalized)
  const local = getOrdersLocal().filter(
    (o) =>
      orderBelongsToEmail(o, normalized)
      || linkedIds.includes(o.id)
      || sessionIds.includes(o.id),
  )
  const merged = mergeOrdersById(remote, local)

  for (const order of merged) {
    linkOrderToAccount(normalized, order.id)
  }

  const others = getOrdersLocal().filter(
    (o) =>
      !orderBelongsToEmail(o, normalized)
      && !linkedIds.includes(o.id)
      && !sessionIds.includes(o.id),
  )
  syncOrdersLocal([...merged, ...others])

  return merged
}

export async function createOrder(params: {
  items: CartItem[]
  billing: OrderBilling
  subtotal: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayPaymentId?: string
  razorpayOrderId?: string
  accountEmail: string
}): Promise<Order> {
  const status = params.paymentStatus === 'paid' ? 'processing' : 'pending'
  const ownerEmail = params.accountEmail.trim().toLowerCase()
  if (!ownerEmail) {
    throw new Error('Please log in to place an order.')
  }
  const billing = {
    ...params.billing,
    email: ownerEmail,
  }

  if (!isSupabaseConfigured()) {
    const order: Order = {
      id: createId(),
      items: params.items,
      billing,
      subtotal: params.subtotal,
      shipping: 0,
      total: params.subtotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus,
      razorpayPaymentId: params.razorpayPaymentId,
      razorpayOrderId: params.razorpayOrderId,
      status,
      createdAt: new Date().toISOString(),
    }
    saveOrderLocal(order)
    trackSessionOrder(order.id)
    linkOrderToAccount(ownerEmail, order.id)
    ordersCache = [order, ...(ordersCache ?? getOrdersLocal())]
    return order
  }

  const client = getSupabase()
  const { data: { session } } = await client.auth.getSession()
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const row = {
    id,
    user_id: session?.user?.id ?? null,
    user_email: ownerEmail,
    items: params.items,
    billing,
    subtotal: params.subtotal,
    shipping: 0,
    total: params.subtotal,
    payment_method: params.paymentMethod,
    payment_status: params.paymentStatus,
    status,
    razorpay_payment_id: params.razorpayPaymentId ?? null,
    razorpay_order_id: params.razorpayOrderId ?? null,
    created_at: createdAt,
  }

  const { error } = await client.from('orders').insert(row)
  if (error) throw new Error(error.message ?? 'Failed to create order')

  const order = mapOrder(row as DbOrder)
  saveOrderLocal(order)
  trackSessionOrder(order.id)
  linkOrderToAccount(ownerEmail, order.id)
  ordersCache = [order, ...(ordersCache ?? [])]
  return order
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
  const orders = getOrders()
  const order = orders.find((o) => o.id === id)
  if (!order || isOrderStatusLocked(order.status)) return false

  const updatedAt = new Date().toISOString()
  const updated = { ...order, status, statusUpdatedAt: updatedAt }

  if (!isSupabaseConfigured()) {
    const next = getOrdersLocal().map((o) => (o.id === id ? updated : o))
    saveStore(KEY, next)
    ordersCache = next
    return true
  }

  const adminClient = await getSupabaseForAdminData()
  const client = adminClient ?? getSupabase()
  const { error } = await client
    .from('orders')
    .update({ status, status_updated_at: updatedAt })
    .eq('id', id)

  saveOrderLocal(updated)
  ordersCache = (ordersCache ?? getOrdersLocal()).map((o) => (o.id === id ? updated : o))
  return !error
}
