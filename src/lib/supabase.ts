import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '../config/env'

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(env.supabaseUrl!, env.supabaseAnonKey!)
  : null

export function getSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}
