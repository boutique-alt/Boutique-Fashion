export interface RazorpayCheckoutOptions {
  amount: number
  currency?: string
  name: string
  description?: string
  orderId?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
}

export interface RazorpayPaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  error?: string
}
