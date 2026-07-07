import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapOrder, type DbOrder } from '../lib/supabaseMappers'
import type { Order, OrderBilling, PaymentMethod, PaymentStatus } from '../types/order'
import { isOrderStatusLocked } from '../types/order'
import type { CartItem } from '../context/StoreContext'
import { getSupabaseForAdminData } from './adminDataClient'

let ordersCache: Order[] | null = null

export function clearOrdersCache(): void {
  ordersCache = null
}

function sortOrdersNewest(a: Order, b: Order): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

async function fetchRemoteOrdersByEmail(email: string): Promise<Order[]> {
  const normalized = email.toLowerCase()
  const client = getSupabase()

  const { data: rpcData, error: rpcError } = await client.rpc('get_orders_by_email', {
    lookup_email: normalized,
  })
  if (!rpcError && rpcData) {
    return (rpcData as DbOrder[]).map(mapOrder).sort(sortOrdersNewest)
  }

  const { data, error } = await client
    .from('orders')
    .select('id, user_id, user_email, items, billing, subtotal, shipping, total, payment_method, payment_status, status, razorpay_payment_id, razorpay_order_id, payment_screenshot_url, status_updated_at, created_at')
    .eq('user_email', normalized)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as DbOrder[]).map(mapOrder)
}

export async function loadOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    ordersCache = []
    return []
  }

  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient
      .from('orders')
      .select('id, user_id, user_email, items, billing, subtotal, shipping, total, payment_method, payment_status, status, razorpay_payment_id, razorpay_order_id, payment_screenshot_url, status_updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500)
    ordersCache = data ? (data as DbOrder[]).map(mapOrder) : []
    return ordersCache
  }

  const { data: { session } } = await getSupabase().auth.getSession()
  const email = session?.user?.email
  if (!email) {
    ordersCache = []
    return []
  }

  ordersCache = await fetchRemoteOrdersByEmail(email)
  return ordersCache
}

export function getOrders(): Order[] {
  return ordersCache ?? []
}

export async function fetchOrdersByEmail(email: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return []
  return fetchRemoteOrdersByEmail(email)
}

export async function createOrder(params: {
  items: CartItem[]
  billing: OrderBilling
  subtotal: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayPaymentId?: string
  razorpayOrderId?: string
  paymentScreenshotUrl?: string
  accountEmail: string
}): Promise<Order> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const status = params.paymentStatus === 'paid' ? 'processing' : 'pending'
  const ownerEmail = params.accountEmail.trim().toLowerCase()
  if (!ownerEmail) {
    throw new Error('Please log in to place an order.')
  }
  const billing = {
    ...params.billing,
    email: ownerEmail,
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
    payment_screenshot_url: params.paymentScreenshotUrl ?? null,
    created_at: createdAt,
  }

  const { error } = await client.from('orders').insert(row)
  if (error) throw new Error(error.message ?? 'Failed to create order')

  // Insert into order_items table for normalized analytics
  const orderItemsData = params.items.map(item => ({
    order_id: id,
    product_slug: item.slug,
    product_name: item.name,
    size: item.size,
    quantity: item.quantity,
    price_at_purchase: item.price
  }));

  const { error: itemsError } = await client.from('order_items').insert(orderItemsData);
  if (itemsError) {
    console.error('Failed to create order_items', itemsError);
  }

  const order = mapOrder(row as DbOrder)
  ordersCache = [order, ...(ordersCache ?? [])]
  return order
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
  const orders = getOrders()
  const order = orders.find((o) => o.id === id)
  if (!order || isOrderStatusLocked(order.status)) return false

  if (!isSupabaseConfigured()) return false

  const updatedAt = new Date().toISOString()
  const updated = { ...order, status, statusUpdatedAt: updatedAt }

  const adminClient = await getSupabaseForAdminData()
  const client = adminClient ?? getSupabase()
  const { error } = await client
    .from('orders')
    .update({ status, status_updated_at: updatedAt })
    .eq('id', id)

  if (error) return false
  ordersCache = (ordersCache ?? []).map((o) => (o.id === id ? updated : o))
  return true
}
