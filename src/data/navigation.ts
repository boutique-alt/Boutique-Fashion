import type { LucideIcon } from 'lucide-react'
import { Layers, Sparkles } from 'lucide-react'

export interface NavChild {
  label: string
  href: string
}

export type NavIcon = 'fabric' | 'bridal'

export interface NavItem {
  label: string
  href?: string
  children?: NavChild[]
  icon?: NavIcon
}

export const navIcons: Record<NavIcon, LucideIcon> = {
  fabric: Layers,
  bridal: Sparkles,
}

export const mainNav: NavItem[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'COLLECTION',
    href: '/dress',
    children: [
      { label: 'Dresses', href: '/dress/one-piece' },
      { label: 'Kurta Set', href: '/dress/kurta-set' },
      { label: 'Coord Set', href: '/dress/coord-set' },
      { label: 'Tops with Pant / Skirt', href: '/dress/tops-pant-skirt' },
      { label: 'Suit Set', href: '/three-piece' },
    ],
  },
  { label: 'MENS', href: '/mens' },
  { label: 'BLOUSE', href: '/blouse' },
  { label: 'FABRIC', href: '/fabric', icon: 'fabric' },
  { label: 'BRIDAL', href: '/bridal', icon: 'bridal' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'CONTACT US', href: '/contact-us' },
]

export const footerSupport = [
  'Privacy Policy',
  'Refund Policy',
  'Shipping & Return',
  'Terms Of Use',
]

export const footerQuickLinks = ['My Account', 'Cart', 'Wishlist', 'Checkout']

export const footerCategories = [
  { label: 'Dresses', href: '/dress/one-piece' },
  { label: 'Kurta Set', href: '/dress/kurta-set' },
  { label: 'Coord Set', href: '/dress/coord-set' },
  { label: 'Tops with Pant / Skirt', href: '/dress/tops-pant-skirt' },
  { label: 'Suit Set', href: '/three-piece' },
  { label: 'Blouse', href: '/blouse' },
  { label: "Men's", href: '/mens' },
  { label: 'Fabric', href: '/fabric' },
  { label: 'Bridal', href: '/bridal' },
]

export const brand = {
  name: 'Boutique Fashion',
  tagline: 'Where Comfort meets Confidence',
  phone: '+91 8334816333',
  email: 'theboutiquesarees@gmail.com',
  address:
    '1st Floor, Juthika Apartment, A1, 409, Garia Station Rd, Garia, Kolkata, West Bengal 700084',
  hours: '9.00am – 8.00pm Everyday',
}
