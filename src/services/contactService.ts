import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapContact, type DbContactMessage } from '../lib/supabaseMappers'
import type { ContactFormData, ContactMessage } from '../types/contact'
import { getSupabaseForAdminData, mergeById } from './adminDataClient'
import { isAdminLoggedIn } from './adminService'
import { loadStore, saveStore } from './storage'

const KEY = 'contact-messages'

let messagesCache: ContactMessage[] | null = null

function getMessagesLocal(): ContactMessage[] {
  return loadStore<ContactMessage[]>(KEY, [])
}

function saveMessageLocal(message: ContactMessage): void {
  const messages = getMessagesLocal().filter((m) => m.id !== message.id)
  saveStore(KEY, [message, ...messages])
}

function sortMessagesNewest(a: ContactMessage, b: ContactMessage): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export async function loadContactMessages(): Promise<ContactMessage[]> {
  const local = getMessagesLocal()

  if (!isSupabaseConfigured()) {
    messagesCache = local
    return local
  }

  let remote: ContactMessage[] = []
  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    const { data } = await adminClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    remote = data ? (data as DbContactMessage[]).map(mapContact) : []
  }

  messagesCache = mergeById(remote, local, sortMessagesNewest)
  return messagesCache
}

export function getContactMessages(): ContactMessage[] {
  if (messagesCache) return messagesCache
  if (!isSupabaseConfigured()) return getMessagesLocal()
  if (isAdminLoggedIn()) return getMessagesLocal()
  return []
}

export async function submitContactMessage(data: ContactFormData): Promise<ContactMessage> {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const message: ContactMessage = {
    id,
    ...data,
    createdAt,
    read: false,
  }

  if (!isSupabaseConfigured()) {
    saveMessageLocal(message)
    messagesCache = [message, ...(messagesCache ?? getMessagesLocal())]
    return message
  }

  const { error } = await getSupabase()
    .from('contact_messages')
    .insert({
      id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      read: false,
      created_at: createdAt,
    })

  if (error) throw new Error(error.message ?? 'Failed to send message')

  saveMessageLocal(message)
  messagesCache = [message, ...(messagesCache ?? [])]
  return message
}

export async function markContactMessageRead(id: string): Promise<void> {
  const messages = getContactMessages()
  const found = messages.find((m) => m.id === id)
  if (!found) return

  const updated = { ...found, read: true }
  saveMessageLocal(updated)

  if (!isSupabaseConfigured()) {
    messagesCache = messages.map((m) => (m.id === id ? updated : m))
    return
  }

  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    await adminClient.from('contact_messages').update({ read: true }).eq('id', id)
  }

  messagesCache = messages.map((m) => (m.id === id ? updated : m))
}

export function getUnreadContactCount(): number {
  return getContactMessages().filter((m) => !m.read).length
}
