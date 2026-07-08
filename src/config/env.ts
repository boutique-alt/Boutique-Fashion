import { upiPaymentDetails } from '../data/payment'

const PLACEHOLDER_UPI_ID = 'boutique@upi'

function resolveUpiId(): string {
  const value = (import.meta.env.VITE_UPI_ID as string | undefined)?.trim()
  if (value && value !== PLACEHOLDER_UPI_ID) return value
  return upiPaymentDetails.upiId
}

function resolveUpiPayeeName(): string {
  const value = (import.meta.env.VITE_UPI_PAYEE_NAME as string | undefined)?.trim()
  if (value && value !== 'Boutique Fashion') return value
  return upiPaymentDetails.payeeName
}

export const env = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined,
  adminEmail: (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '',
  adminPassword: (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  upiId: resolveUpiId(),
  upiPayeeName: resolveUpiPayeeName(),
}

export const isRazorpayConfigured = () => Boolean(env.razorpayKeyId)
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey)
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
}
