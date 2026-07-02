import { env, isSupabaseConfigured } from '../config/env'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'

export interface AdminSyncResult {
  ok: boolean
  error?: string
}

let adminVerified = false
let lastSyncError: string | undefined

function matchesEnvAdmin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === env.adminEmail.trim().toLowerCase()
    && password === env.adminPassword
  )
}

export function isAdminCredentials(email: string, password: string): boolean {
  return matchesEnvAdmin(email, password)
}

export function getLastAdminSyncError(): string | undefined {
  return lastSyncError
}

async function ensureAdminUserRow(): Promise<void> {
  const { error } = await getSupabaseAdmin().rpc('bootstrap_admin', { admin_email: env.adminEmail })
  if (error) {
    console.warn('bootstrap_admin:', error.message)
  }
}

async function signInOrCreateAdminUser(): Promise<AdminSyncResult> {
  const client = getSupabaseAdmin()
  const email = env.adminEmail.trim()
  const password = env.adminPassword

  const signIn = await client.auth.signInWithPassword({ email, password })
  if (signIn.data.session) return { ok: true }

  const signInCode = signIn.error?.code
  if (signInCode === 'email_not_confirmed') {
    return {
      ok: false,
      error: `Supabase admin email (${email}) is not confirmed. Open Supabase Dashboard → SQL Editor → run supabase/migrations/004_confirm_admin_email.sql, then log out and log in again.`,
    }
  }

  const signInError = signIn.error?.message ?? 'Sign in failed'
  const shouldTrySignUp =
    signInError.toLowerCase().includes('invalid')
    || signInError.toLowerCase().includes('credentials')
    || signInError.toLowerCase().includes('not found')

  if (!shouldTrySignUp) {
    return { ok: false, error: signInError }
  }

  const signUp = await client.auth.signUp({ email, password })
  if (signUp.error) {
    if (signUp.error.message.toLowerCase().includes('already')) {
      return {
        ok: false,
        error: `Supabase already has ${email}, but the password does not match VITE_ADMIN_PASSWORD. In Supabase Dashboard → Authentication → Users, reset that user's password to match your .env file, or delete the user and save again.`,
      }
    }
    return { ok: false, error: signUp.error.message }
  }

  if (signUp.data.session) return { ok: true }

  const retry = await client.auth.signInWithPassword({ email, password })
  if (retry.data.session) return { ok: true }

  return {
    ok: false,
    error: retry.error?.message
      ?? 'Admin account could not be signed in. In Supabase, enable email signups and run supabase/migrations/004_confirm_admin_email.sql.',
  }
}

export async function hasSupabaseAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const { data: { session } } = await getSupabaseAdmin().auth.getSession()
  return session?.user.email?.toLowerCase() === env.adminEmail.toLowerCase()
}

export async function syncSupabaseAdminSession(): Promise<AdminSyncResult> {
  if (!isSupabaseConfigured()) {
    lastSyncError = undefined
    return { ok: false }
  }

  if (await hasSupabaseAdminSession()) {
    await ensureAdminUserRow()
    lastSyncError = undefined
    return { ok: true }
  }

  if (!adminVerified) {
    return { ok: false, error: 'Admin not signed in' }
  }

  const result = await signInOrCreateAdminUser()
  if (!result.ok) {
    lastSyncError = result.error
    return result
  }

  await ensureAdminUserRow()
  lastSyncError = undefined
  return { ok: true }
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
  if (ok) {
    await ensureAdminUserRow()
  }
  return ok
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; syncWarning?: string }> {
  if (!matchesEnvAdmin(email, password)) {
    return { ok: false, error: 'Invalid email or password' }
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is required for admin login' }
  }

  const sync = await signInOrCreateAdminUser()
  if (!sync.ok) {
    return { ok: false, error: sync.error ?? 'Admin login failed' }
  }

  await ensureAdminUserRow()
  adminVerified = true
  lastSyncError = undefined
  return { ok: true }
}

export async function adminLogout(): Promise<void> {
  adminVerified = false
  lastSyncError = undefined
  if (isSupabaseConfigured()) {
    await getSupabaseAdmin().auth.signOut()
  }
}

export function usesSupabaseAdmin(): boolean {
  return isSupabaseConfigured()
}
