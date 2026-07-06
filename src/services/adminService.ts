import { isSupabaseConfigured } from '../config/env'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'

export interface AdminSyncResult {
  ok: boolean
  error?: string
}

let adminVerified = false
let lastSyncError: string | undefined

export function clearAdminCache(): void {
  adminVerified = false
  lastSyncError = undefined
}

export function getLastAdminSyncError(): string | undefined {
  return lastSyncError
}

async function isActiveAdminUser(userId: string): Promise<boolean> {
  const { data } = await getSupabaseAdmin()
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .eq('is_active', true)
    .maybeSingle()
  return Boolean(data)
}

async function signInAdmin(email: string, password: string): Promise<AdminSyncResult> {
  const client = getSupabaseAdmin()
  const normalizedEmail = email.trim().toLowerCase()
  const signIn = await client.auth.signInWithPassword({ email: normalizedEmail, password })

  if (signIn.error) {
    if (signIn.error.code === 'email_not_confirmed') {
      return {
        ok: false,
        error: 'Admin email is not confirmed. Confirm the user in Supabase Dashboard → Authentication, then try again.',
      }
    }
    return { ok: false, error: 'Invalid email or password' }
  }

  if (!signIn.data.user) {
    return { ok: false, error: 'Invalid email or password' }
  }

  const isAdmin = await isActiveAdminUser(signIn.data.user.id)
  if (!isAdmin) {
    await client.auth.signOut()
    return { ok: false, error: 'Invalid email or password' }
  }

  return { ok: true }
}

export async function hasSupabaseAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const { data: { session } } = await getSupabaseAdmin().auth.getSession()
  if (!session?.user) return false
  return isActiveAdminUser(session.user.id)
}

export async function syncSupabaseAdminSession(): Promise<AdminSyncResult> {
  if (!isSupabaseConfigured()) {
    lastSyncError = undefined
    return { ok: false }
  }

  const ok = await hasSupabaseAdminSession()
  if (ok) {
    lastSyncError = undefined
    return { ok: true }
  }

  adminVerified = false
  lastSyncError = 'Admin not signed in'
  return { ok: false, error: lastSyncError }
}

export function isAdminLoggedIn(): boolean {
  return adminVerified
}

export async function verifyAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    adminVerified = false
    return false
  }

  const ok = await hasSupabaseAdminSession()
  adminVerified = ok
  return ok
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; syncWarning?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is required for admin login' }
  }

  const result = await signInAdmin(email, password)
  if (!result.ok) {
    return { ok: false, error: result.error ?? 'Admin login failed' }
  }

  adminVerified = true
  lastSyncError = undefined
  return { ok: true }
}

export async function adminLogout(): Promise<void> {
  clearAdminCache()
  if (isSupabaseConfigured()) {
    await getSupabaseAdmin().auth.signOut()
  }
}

export function usesSupabaseAdmin(): boolean {
  return isSupabaseConfigured()
}
