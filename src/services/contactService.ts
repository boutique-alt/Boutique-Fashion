import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { mapContact, type DbContactMessage } from '../lib/supabaseMappers'
import type { ContactFormData, ContactMessage } from '../types/contact'
import { getSupabaseForAdminData } from './adminDataClient'

let messagesCache: ContactMessage[] | null = null

function sortMessagesNewest(a: ContactMessage, b: ContactMessage): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export async function loadContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    messagesCache = []
    return []
  }

  const adminClient = await getSupabaseForAdminData()
  if (!adminClient) {
    messagesCache = []
    return []
  }

  const { data } = await adminClient
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  messagesCache = data ? (data as DbContactMessage[]).map(mapContact).sort(sortMessagesNewest) : []
  return messagesCache
}

export function getContactMessages(): ContactMessage[] {
  return messagesCache ?? []
}

export async function submitContactMessage(data: ContactFormData): Promise<ContactMessage> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const message: ContactMessage = {
    id,
    ...data,
    createdAt,
    read: false,
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

  messagesCache = [message, ...(messagesCache ?? [])]
  return message
}

export async function markContactMessageRead(id: string): Promise<void> {
  const messages = getContactMessages()
  const found = messages.find((m) => m.id === id)
  if (!found) return

  const updated = { ...found, read: true }
  messagesCache = messages.map((m) => (m.id === id ? updated : m))

  if (!isSupabaseConfigured()) return

  const adminClient = await getSupabaseForAdminData()
  if (adminClient) {
    await adminClient.from('contact_messages').update({ read: true }).eq('id', id)
  }
}

export function getUnreadContactCount(): number {
  return getContactMessages().filter((m) => !m.read).length
}
