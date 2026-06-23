import type { ContactFormData, ContactMessage } from '../types/contact'
import { createId, loadStore, saveStore } from './storage'

const KEY = 'contact-messages'

export function getContactMessages(): ContactMessage[] {
  return loadStore<ContactMessage[]>(KEY, [])
}

export function submitContactMessage(data: ContactFormData): ContactMessage {
  const message: ContactMessage = {
    id: createId(),
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  }
  const messages = getContactMessages()
  saveStore(KEY, [message, ...messages])
  return message
}

export function markContactMessageRead(id: string): void {
  const messages = getContactMessages().map((m) =>
    m.id === id ? { ...m, read: true } : m,
  )
  saveStore(KEY, messages)
}

export function getUnreadContactCount(): number {
  return getContactMessages().filter((m) => !m.read).length
}
