export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href?: string
  children?: NavChild[]
}

export const mainNav: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  {
    label: 'DRESS',
    href: '/dress',
    children: [
      { label: 'One Piece', href: '/dress/one-piece' },
      { label: 'Two Piece', href: '/dress/two-piece' },
    ],
  },
  { label: 'MENS', href: '/mens' },
  { label: 'BLOUSE', href: '/blouse' },
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
  { label: 'One Piece', href: '/dress/one-piece' },
  { label: 'Two Piece', href: '/dress/two-piece' },
  { label: 'Blouse', href: '/blouse' },
  { label: "Men's", href: '/mens' },
  { label: 'Three Piece', href: '/three-piece' },
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
