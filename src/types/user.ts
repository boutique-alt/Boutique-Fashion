export type UserGender = 'male' | 'female' | 'other' | ''

export interface UserAddress {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  gender?: UserGender
  voluntaryConsent?: boolean
  address?: UserAddress
  role?: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserSession {
  name: string
  email: string
}
