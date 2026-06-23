export interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  createdAt: string
  read: boolean
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}
