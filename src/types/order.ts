import type { CartItem } from '../context/StoreContext'

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const LOCKED_ORDER_STATUSES: OrderStatus[] = ['delivered', 'cancelled']

export function isOrderStatusLocked(status: OrderStatus): boolean {
  return LOCKED_ORDER_STATUSES.includes(status)
}
export type PaymentMethod = 'razorpay' | 'cod' | 'upi'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface OrderBilling {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  notes?: string
}

export interface Order {
  id: string
  items: CartItem[]
  billing: OrderBilling
  subtotal: number
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayPaymentId?: string
  razorpayOrderId?: string
  paymentScreenshotUrl?: string
  status: OrderStatus
  statusUpdatedAt?: string
  createdAt: string
}
