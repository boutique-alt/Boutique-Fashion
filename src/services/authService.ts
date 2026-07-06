import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import type { UserSession } from '../types/user'
import { clearOrdersCache } from './orderService'
import { clearReturnsCache } from './returnService'
import { clearAdminCache } from './adminService'
import { clearContactCache } from './contactService'
import { clearAnalyticsCache } from './analyticsService'

function sessionFromSupabaseUser(
  user: { email?: string | null; user_metadata?: Record<string, unknown> },
  fallbackEmail: string,
): UserSession {
  const email = user.email ?? fallbackEmail
  const name = (user.user_metadata?.name as string) || email.split('@')[0]
  return { name, email }
}

async function upsertCustomerProfile(userId: string, email: string, name: string): Promise<void> {
  await getSupabase().from('profiles').upsert({
    id: userId,
    email: email.toLowerCase(),
    name,
    updated_at: new Date().toISOString(),
  })
}

function isAlreadyRegisteredError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('already registered') || lower.includes('already been registered')
}

function isEmailNotConfirmedError(message: string): boolean {
  return message.toLowerCase().includes('email not confirmed')
}

function requireSupabase(): { ok: true } | { ok: false; error: string } {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured. Please check your environment.' }
  }
  return { ok: true }
}

export async function customerSignUp(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const check = requireSupabase()
  if (!check.ok) return check

  const normalizedEmail = email.trim().toLowerCase()
  const client = getSupabase()
  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: { name } },
  })

  if (error) {
    if (isAlreadyRegisteredError(error.message)) {
      const signIn = await client.auth.signInWithPassword({ email: normalizedEmail, password })
      if (!signIn.error && signIn.data.user) {
        await upsertCustomerProfile(signIn.data.user.id, normalizedEmail, name)
        return { ok: true }
      }
      return { ok: false, error: signIn.error?.message ?? 'Account already exists. Please log in.' }
    }
    return { ok: false, error: error.message }
  }

  if (data.user) {
    await upsertCustomerProfile(data.user.id, normalizedEmail, name)
  }

  if (data.session) {
    return { ok: true }
  }

  const signIn = await client.auth.signInWithPassword({ email: normalizedEmail, password })
  if (!signIn.error && signIn.data.user) {
    return { ok: true }
  }

  if (signIn.error && isEmailNotConfirmedError(signIn.error.message)) {
    return {
      ok: false,
      error: 'Account created. Please check your email to confirm, then log in.',
    }
  }

  return { ok: false, error: signIn.error?.message ?? 'Registration failed' }
}

export async function customerSignIn(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; session?: UserSession }> {
  const check = requireSupabase()
  if (!check.ok) return check

  const normalizedEmail = email.trim().toLowerCase()
  const client = getSupabase()
  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  })

  if (error) {
    if (isEmailNotConfirmedError(error.message)) {
      return { ok: false, error: 'Please confirm your email before logging in.' }
    }
    return { ok: false, error: error.message }
  }

  if (!data.user) {
    return { ok: false, error: 'Login failed' }
  }

  const { data: admin } = await client
    .from('admin_users')
    .select('id')
    .eq('id', data.user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (admin) {
    await client.auth.signOut()
    return { ok: false, error: 'Please use admin login for this account' }
  }

  return {
    ok: true,
    session: sessionFromSupabaseUser(data.user, normalizedEmail),
  }
}

export async function customerSignOut(): Promise<void> {
  clearOrdersCache()
  clearReturnsCache()
  clearAdminCache()
  clearContactCache()
  clearAnalyticsCache()
  if (!isSupabaseConfigured()) return
  await getSupabase().auth.signOut()
}

export async function getCustomerSession(): Promise<UserSession | null> {
  if (!isSupabaseConfigured()) return null

  const client = getSupabase()
  const { data: { session } } = await client.auth.getSession()
  if (!session?.user) return null

  return sessionFromSupabaseUser(session.user, session.user.email ?? '')
}

export async function getCustomerUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  const { data: { session } } = await getSupabase().auth.getSession()
  return session?.user?.id ?? null
}

export async function requestPasswordReset(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const check = requireSupabase()
  if (!check.ok) return check

  const normalizedEmail = email.trim().toLowerCase()
  const { error } = await getSupabase().auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${window.location.origin}/account/reset-password`,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function updateCustomerPassword(
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const check = requireSupabase()
  if (!check.ok) return check

  const { error } = await getSupabase().auth.updateUser({ password })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
