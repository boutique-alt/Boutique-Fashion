import type { Order, OrderBilling, PaymentMethod, PaymentStatus } from '../types/order'
import type { CartItem } from '../context/StoreContext'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'orders'

export function getOrders(): Order[] {
  return loadStore<Order[]>(KEY, [])
}

export function getOrdersByEmail(email: string): Order[] {
  return getOrders().filter((o) => o.billing.email.toLowerCase() === email.toLowerCase())
}

export function createOrder(params: {
  items: CartItem[]
  billing: OrderBilling
  subtotal: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayPaymentId?: string
  razorpayOrderId?: string
}): Order {
  const order: Order = {
    id: createId(),
    items: params.items,
    billing: params.billing,
    subtotal: params.subtotal,
    shipping: 0,
    total: params.subtotal,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentStatus,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpayOrderId: params.razorpayOrderId,
    status: params.paymentStatus === 'paid' ? 'processing' : 'pending',
    createdAt: new Date().toISOString(),
  }
  const orders = getOrders()
  saveStore(KEY, [order, ...orders])
  return order
}

export function updateOrderStatus(id: string, status: Order['status']): void {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o))
  saveStore(KEY, orders)
}
