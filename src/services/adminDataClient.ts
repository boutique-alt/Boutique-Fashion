import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { isAdminLoggedIn, syncSupabaseAdminSession } from './adminService'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getSupabaseForAdminData(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured() || !isAdminLoggedIn()) return null
  const sync = await syncSupabaseAdminSession()
  if (!sync.ok) return null
  return getSupabaseAdmin()
}

export function getSupabaseForCustomer(): SupabaseClient {
  return getSupabase()
}

export function mergeById<T extends { id: string }>(
  remote: T[],
  local: T[],
  sortNewest?: (a: T, b: T) => number,
): T[] {
  const map = new Map<string, T>()
  for (const item of local) map.set(item.id, item)
  for (const item of remote) map.set(item.id, item)
  const merged = [...map.values()]
  if (sortNewest) merged.sort(sortNewest)
  return merged
}
