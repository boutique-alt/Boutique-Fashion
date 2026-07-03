import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapProfile, type DbProfile } from '../lib/supabaseMappers'
import type { UserAddress, UserProfile, UserSession } from '../types/user'
import { getSupabaseForAdminData } from './adminDataClient'

const profileListeners = new Set<() => void>()

export function subscribeProfileChanged(listener: () => void): () => void {
  profileListeners.add(listener)
  return () => profileListeners.delete(listener)
}

function notifyProfileChanged(): void {
  profileListeners.forEach((listener) => listener())
}

export async function fetchProfileByEmail(email: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null

  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error || !data) return null
  return mapProfile(data as DbProfile)
}

export async function getOrCreateProfile(session: UserSession): Promise<UserProfile> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const client = getSupabase()
  const { data: { session: authSession } } = await client.auth.getSession()
  if (!authSession?.user) {
    throw new Error('Not authenticated')
  }

  const existing = await fetchProfileByEmail(session.email)
  if (existing) return existing

  const now = new Date().toISOString()
  const { data, error } = await client
    .from('profiles')
    .upsert({
      id: authSession.user.id,
      email: session.email.toLowerCase(),
      name: session.name,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Failed to create profile')
  notifyProfileChanged()
  return mapProfile(data as DbProfile)
}

export async function updateProfile(
  email: string,
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>,
): Promise<UserProfile> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const key = email.toLowerCase()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) payload.name = updates.name
  if (updates.phone !== undefined) payload.phone = updates.phone
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl
  if (updates.gender !== undefined) payload.gender = updates.gender
  if (updates.voluntaryConsent !== undefined) payload.voluntary_consent = updates.voluntaryConsent
  if (updates.address !== undefined) payload.address = updates.address

  const { data, error } = await getSupabase()
    .from('profiles')
    .update(payload)
    .eq('email', key)
    .select('*')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Profile not found')
  notifyProfileChanged()
  return mapProfile(data as DbProfile)
}

export function updateProfileAvatar(email: string, avatarUrl: string): Promise<UserProfile> {
  return updateProfile(email, { avatarUrl })
}

export function updateProfileAddress(email: string, address: UserAddress): Promise<UserProfile> {
  return updateProfile(email, { address })
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) return []

  const adminClient = await getSupabaseForAdminData()
  if (!adminClient) return []

  const { data } = await adminClient.from('profiles').select('*')
  return data ? (data as DbProfile[]).map(mapProfile) : []
}
