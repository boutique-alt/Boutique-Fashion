export const env = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined,
  adminEmail: (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '',
  adminPassword: (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  upiId: (import.meta.env.VITE_UPI_ID as string | undefined) ?? '',
  upiPayeeName: (import.meta.env.VITE_UPI_PAYEE_NAME as string | undefined) ?? '',
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
