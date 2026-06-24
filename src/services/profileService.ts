import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseForAdminData } from './adminDataClient'
import { isLocalCustomerEmail } from './authService'
import { mapProfile, type DbProfile } from '../lib/supabaseMappers'
import type { UserAddress, UserProfile, UserSession } from '../types/user'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'profiles'

function getProfiles(): Record<string, UserProfile> {
  return loadStore<Record<string, UserProfile>>(KEY, {})
}

function saveProfiles(profiles: Record<string, UserProfile>): void {
  saveStore(KEY, profiles)
}

function createLocalProfile(session: UserSession): UserProfile {
  const key = session.email.toLowerCase()
  const profiles = getProfiles()
  if (profiles[key]) return profiles[key]

  const now = new Date().toISOString()
  const profile: UserProfile = {
    id: createId(),
    name: session.name,
    email: session.email,
    role: 'user',
    createdAt: now,
    updatedAt: now,
  }
  profiles[key] = profile
  saveProfiles(profiles)
  return profile
}

function usesLocalProfile(email: string): boolean {
  if (!isSupabaseConfigured()) return true
  return isLocalCustomerEmail(email)
}

export function getProfileByEmail(email: string): UserProfile | null {
  const profiles = getProfiles()
  return profiles[email.toLowerCase()] ?? null
}

export async function fetchProfileByEmail(email: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured() || usesLocalProfile(email)) {
    return getProfileByEmail(email)
  }

  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle()
  if (error || !data) return getProfileByEmail(email)
  return mapProfile(data as DbProfile)
}

export async function getOrCreateProfile(session: UserSession): Promise<UserProfile> {
  const local = getProfileByEmail(session.email)
  if (local) return local

  if (!isSupabaseConfigured() || usesLocalProfile(session.email)) {
    return createLocalProfile(session)
  }

  const client = getSupabase()
  const { data: { session: authSession } } = await client.auth.getSession()
  if (!authSession?.user) {
    return createLocalProfile(session)
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

  if (error || !data) return createLocalProfile(session)
  return mapProfile(data as DbProfile)
}

export async function updateProfile(
  email: string,
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>,
): Promise<UserProfile> {
  const key = email.toLowerCase()

  if (!isSupabaseConfigured() || usesLocalProfile(email)) {
    const profiles = getProfiles()
    const existing = profiles[key] ?? createLocalProfile({ name: updates.name ?? email.split('@')[0], email })
    const updated: UserProfile = {
      ...existing,
      ...updates,
      email: existing.email,
      updatedAt: new Date().toISOString(),
    }
    profiles[key] = updated
    saveProfiles(profiles)
    return updated
  }

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

  if (error || !data) {
    const profiles = getProfiles()
    const existing = profiles[key]
    if (!existing) throw new Error('Profile not found')
    const updated: UserProfile = {
      ...existing,
      ...updates,
      email: existing.email,
      updatedAt: new Date().toISOString(),
    }
    profiles[key] = updated
    saveProfiles(profiles)
    return updated
  }

  return mapProfile(data as DbProfile)
}

export function updateProfileAvatar(email: string, avatarUrl: string): Promise<UserProfile> {
  return updateProfile(email, { avatarUrl })
}

export function updateProfileAddress(email: string, address: UserAddress): Promise<UserProfile> {
  return updateProfile(email, { address })
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  const local = Object.values(getProfiles())

  if (!isSupabaseConfigured()) return local

  let remote: UserProfile[] = []
  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient.from('profiles').select('*')
    remote = data ? (data as DbProfile[]).map(mapProfile) : []
  }

  const byEmail = new Map<string, UserProfile>()
  for (const p of local) byEmail.set(p.email.toLowerCase(), p)
  for (const p of remote) byEmail.set(p.email.toLowerCase(), p)
  return [...byEmail.values()]
}
