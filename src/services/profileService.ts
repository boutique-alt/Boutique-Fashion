import type { UserAddress, UserProfile, UserSession } from '../types/user'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'profiles'

function getProfiles(): Record<string, UserProfile> {
  return loadStore<Record<string, UserProfile>>(KEY, {})
}

function saveProfiles(profiles: Record<string, UserProfile>): void {
  saveStore(KEY, profiles)
}

export function getProfileByEmail(email: string): UserProfile | null {
  const profiles = getProfiles()
  return profiles[email.toLowerCase()] ?? null
}

export function getOrCreateProfile(session: UserSession): UserProfile {
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

export function updateProfile(email: string, updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>): UserProfile {
  const key = email.toLowerCase()
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

export function updateProfileAvatar(email: string, avatarUrl: string): UserProfile {
  return updateProfile(email, { avatarUrl })
}

export function updateProfileAddress(email: string, address: UserAddress): UserProfile {
  return updateProfile(email, { address })
}

export function getAllProfiles(): UserProfile[] {
  return Object.values(getProfiles())
}
