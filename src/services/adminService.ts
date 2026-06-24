import { env, isSupabaseConfigured } from '../config/env'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { loadStore, saveStore } from './storage'

const KEY = 'admin-session'

interface AdminSession {
  loggedIn: boolean
  loggedInAt: string
}

let adminVerified = false

function isAdminLoggedInLocal(): boolean {
  const session = loadStore<AdminSession | null>(KEY, null)
  return Boolean(session?.loggedIn)
}

function matchesEnvAdmin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === env.adminEmail.trim().toLowerCase()
    && password === env.adminPassword
  )
}

export function isAdminCredentials(email: string, password: string): boolean {
  return matchesEnvAdmin(email, password)
}

async function signInAdminUser(): Promise<boolean> {
  const { data } = await getSupabaseAdmin().auth.signInWithPassword({
    email: env.adminEmail,
    password: env.adminPassword,
  })
  return Boolean(data.session)
}

async function ensureAdminUserRow(): Promise<void> {
  await getSupabaseAdmin().rpc('bootstrap_admin', { admin_email: env.adminEmail })
}

export async function hasSupabaseAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const { data: { session } } = await getSupabaseAdmin().auth.getSession()
  return session?.user.email?.toLowerCase() === env.adminEmail.toLowerCase()
}

export async function syncSupabaseAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured() || !isAdminLoggedInLocal()) return false

  if (await hasSupabaseAdminSession()) {
    await ensureAdminUserRow()
    return true
  }

  const ok = await signInAdminUser()
  if (!ok) return false

  await ensureAdminUserRow()
  return true
}

export function isAdminLoggedIn(): boolean {
  return isAdminLoggedInLocal() || adminVerified
}

export async function verifyAdminSession(): Promise<boolean> {
  if (!isAdminLoggedInLocal()) {
    adminVerified = false
    return false
  }

  adminVerified = true
  void syncSupabaseAdminSession()
  return true
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!matchesEnvAdmin(email, password)) {
    return { ok: false, error: 'Invalid email or password' }
  }

  saveStore(KEY, { loggedIn: true, loggedInAt: new Date().toISOString() })
  adminVerified = true
  void syncSupabaseAdminSession()
  return { ok: true }
}

export async function adminLogout(): Promise<void> {
  adminVerified = false
  if (isSupabaseConfigured()) {
    await getSupabaseAdmin().auth.signOut()
  }
  localStorage.removeItem('bf-admin-session')
}

export function usesSupabaseAdmin(): boolean {
  return isSupabaseConfigured()
}
