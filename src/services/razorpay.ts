import { env, isRazorpayConfigured } from '../config/env'
import type { RazorpayCheckoutOptions, RazorpayPaymentResult } from '../types/payment'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: Record<string, string>) => void) => void
    }
  }
}

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
let scriptPromise: Promise<void> | null = null

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export async function initiateRazorpayPayment(
  options: RazorpayCheckoutOptions,
): Promise<RazorpayPaymentResult> {
  if (!isRazorpayConfigured()) {
    await new Promise((r) => setTimeout(r, 800))
    return {
      success: true,
      paymentId: `mock_pay_${Date.now()}`,
      orderId: options.orderId ?? `mock_order_${Date.now()}`,
    }
  }

  try {
    await loadRazorpayScript()
  } catch {
    return { success: false, error: 'Could not load Razorpay checkout' }
  }

  return new Promise((resolve) => {
    const rzp = new window.Razorpay!({
      key: env.razorpayKeyId,
      amount: options.amount,
      currency: options.currency ?? 'INR',
      name: options.name,
      description: options.description ?? 'Order Payment',
      order_id: options.orderId,
      prefill: options.prefill,
      notes: options.notes,
      theme: { color: '#2F4799' },
      handler: (response: Record<string, string>) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        })
      },
      modal: {
        ondismiss: () => resolve({ success: false, error: 'Payment cancelled' }),
      },
    })
    rzp.open()
  })
}
