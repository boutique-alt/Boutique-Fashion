export const env = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  upiId: (import.meta.env.VITE_UPI_ID as string | undefined) ?? '2470709a@bandhan',
  upiPayeeName: (import.meta.env.VITE_UPI_PAYEE_NAME as string | undefined) ?? 'PIXEL SOLUTION',
}

export const isRazorpayConfigured = () => Boolean(env.razorpayKeyId)
export const isSupabaseConfigured = () => Boolean(env.supabaseUrl && env.supabaseAnonKey)
