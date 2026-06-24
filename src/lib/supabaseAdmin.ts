import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '../config/env'

let adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }
  if (!adminClient) {
    adminClient = createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        storageKey: 'bf-admin-supabase-auth',
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return adminClient
}
