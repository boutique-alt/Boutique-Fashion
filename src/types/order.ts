import type { CartItem } from '../context/StoreContext'

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'razorpay' | 'cod'
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
  status: OrderStatus
  createdAt: string
}
