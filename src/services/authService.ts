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

export async function customerSignUp(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; local?: boolean }> {
  saveLocalAccount({ email, name, password })

  if (!isSupabaseConfigured()) {
    return { ok: true, local: true }
  }

  const client = getSupabase()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error || !data.user || !data.session) {
    return { ok: true, local: true }
  }

  await client.from('profiles').upsert({
    id: data.user.id,
    email: email.toLowerCase(),
    name,
    updated_at: new Date().toISOString(),
  })

  return { ok: true }
}

export async function customerSignIn(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; session?: UserSession }> {
  const local = findLocalAccount(email, password)
  if (local) {
    return { ok: true, session: { name: local.name, email: local.email } }
  }

  if (!isSupabaseConfigured()) {
    return { ok: true, session: { name: email.split('@')[0], email } }
  }

  const client = getSupabase()
  const { data, error } = await client.auth.signInWithPassword({ email, password })

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

    const name = (data.user.user_metadata?.name as string) || email.split('@')[0]
    return { ok: true, session: { name, email: data.user.email ?? email } }
  }

  return { ok: false, error: error?.message ?? 'Login failed' }
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

  const email = session.user.email ?? ''
  const name = (session.user.user_metadata?.name as string) || email.split('@')[0]
  return { name, email }
}
