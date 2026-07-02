import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import type { UserSession } from '../types/user'
import { loadStore, saveStore } from './storage'

const ACCOUNTS_KEY = 'customer-accounts'

interface LocalCustomerAccount {
  email: string
  name: string
  password: string
}

function getLocalAccounts(): LocalCustomerAccount[] {
  return loadStore<LocalCustomerAccount[]>(ACCOUNTS_KEY, [])
}

function saveLocalAccount(account: LocalCustomerAccount): void {
  const accounts = getLocalAccounts().filter(
    (a) => a.email.toLowerCase() !== account.email.toLowerCase(),
  )
  saveStore(ACCOUNTS_KEY, [...accounts, account])
}

function findLocalAccount(email: string, password: string): LocalCustomerAccount | null {
  const account = getLocalAccounts().find(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  )
  if (!account || account.password !== password) return null
  return account
}

export function isLocalCustomerEmail(email: string): boolean {
  return getLocalAccounts().some(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  )
}

function sessionFromSupabaseUser(user: { email?: string | null; user_metadata?: Record<string, unknown> }, fallbackEmail: string): UserSession {
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

export async function customerSignUp(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; local?: boolean }> {
  const normalizedEmail = email.trim().toLowerCase()
  saveLocalAccount({ email: normalizedEmail, name, password })

  if (!isSupabaseConfigured()) {
    return { ok: true, local: true }
  }

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

  return { ok: true, local: true }
}

export async function customerSignIn(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; session?: UserSession }> {
  const normalizedEmail = email.trim().toLowerCase()

  if (isSupabaseConfigured()) {
    const client = getSupabase()
    const { data, error } = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (!error && data.user) {
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

    if (error && !isEmailNotConfirmedError(error.message)) {
      const local = findLocalAccount(normalizedEmail, password)
      if (local) {
        return { ok: true, session: { name: local.name, email: local.email } }
      }
      return { ok: false, error: error.message }
    }

    if (error && isEmailNotConfirmedError(error.message)) {
      return { ok: false, error: 'Please confirm your email before logging in.' }
    }
  }

  const local = findLocalAccount(normalizedEmail, password)
  if (local) {
    return { ok: true, session: { name: local.name, email: local.email } }
  }

  if (!isSupabaseConfigured()) {
    return { ok: true, session: { name: normalizedEmail.split('@')[0], email: normalizedEmail } }
  }

  return { ok: false, error: 'Login failed' }
}

export async function customerSignOut(): Promise<void> {
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
