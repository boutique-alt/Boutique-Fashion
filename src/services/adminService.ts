import { env } from '../config/env'
import { loadStore, saveStore } from './storage'

const KEY = 'admin-session'

interface AdminSession {
  loggedIn: boolean
  loggedInAt: string
}

export function isAdminLoggedIn(): boolean {
  const session = loadStore<AdminSession | null>(KEY, null)
  return Boolean(session?.loggedIn)
}

export function adminLogin(password: string): boolean {
  if (password !== env.adminPassword) return false
  saveStore(KEY, { loggedIn: true, loggedInAt: new Date().toISOString() })
  return true
}

export function adminLogout(): void {
  localStorage.removeItem('bf-admin-session')
}
