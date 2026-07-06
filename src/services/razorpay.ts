import { env, isRazorpayConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
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
  options: RazorpayCheckoutOptions & { items?: any[]; billing?: any },
): Promise<RazorpayPaymentResult> {
  if (!isRazorpayConfigured()) {
    return {
      success: false,
      error: 'Online payment is not available right now. Please use UPI or Cash on Delivery.',
    }
  }

  try {
    await loadRazorpayScript()
  } catch {
    return { success: false, error: 'Could not load Razorpay checkout' }
  }

  // Create order via Edge Function
  const { data: edgeData, error: edgeError } = await getSupabase().functions.invoke(
    'create-razorpay-order',
    { body: { items: options.items, billing: options.billing } },
  )

  if (edgeError || !edgeData?.order_id) {
    return { success: false, error: edgeError?.message ?? 'Failed to create secure payment order' }
  }

  return new Promise((resolve) => {
    const rzp = new window.Razorpay!({
      key: env.razorpayKeyId,
      amount: edgeData.amount, // use backend calculated amount
      currency: options.currency ?? 'INR',
      name: options.name,
      description: options.description ?? 'Order Payment',
      order_id: edgeData.order_id, // use backend generated order ID
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
