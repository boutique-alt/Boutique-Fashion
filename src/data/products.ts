import { blouseCategoryImage, blouseProducts } from './blouseProducts'
import { dressCategoryImage, dressProducts } from './dressProducts'
import { kurtaCoordCategoryImage, kurtaCoordProducts } from './kurtaCoordProducts'
import { mensCategoryImage, mensExclusiveBanner, mensProducts } from './mensProducts'

const BF = 'https://boutiquefashion.shop/wp-content/uploads'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  href?: string
  isNew?: boolean
  onSale?: boolean
}

const onePiece: Product[] = dressProducts

const twoPiece: Product[] = kurtaCoordProducts

const blouse: Product[] = blouseProducts

const mens: Product[] = mensProducts

export const bestSellerProducts: Record<string, Product[]> = {
  'ONE PIECE': onePiece,
  'TWO PIECE': twoPiece,
  BLOUSE: blouse,
}

export const exclusiveCollectionProducts: Product[] = [
  onePiece[0],
  twoPiece[0],
  onePiece[1],
  twoPiece[9],
  blouse[0],
  twoPiece[10],
]

export const mensCollectionProducts: Product[] = mens

const M3 = `${BF}/2026/03`

export interface HeroSlide {
  tag: string
  title: string
  subtitle: string
  description?: string
  image: string
  cta: string
  href: string
  bgColor: string
  objectPosition?: string
}

export const heroSlides: HeroSlide[] = [
  {
    tag: 'Summer Collections',
    title: 'Premium Summer Kurtis &',
    subtitle: 'Indo-Western Collection',
    description:
      'Discover breathable summer kurtis, elegant indo-western outfits, and ready-to-wear sarees designed for modern women.',
    image: `${M3}/prod-1-1.png`,
    cta: 'Explore Collection',
    href: '/dress/one-piece',
    bgColor: '#e8d9d0',
  },
  {
    tag: 'Summer Collections',
    title: 'Refined Menswear &',
    subtitle: 'Handblock Shirts',
    description:
      'Premium cotton shirts with artisanal handblock prints — crafted for comfort, character, and everyday elegance.',
    image: `${M3}/hero-scaled.png`,
    cta: 'View Collection',
    href: '/mens',
    bgColor: '#e8d9d0',
    objectPosition: 'center top',
  },
]

export const features = [
  { title: 'Uniqueness', text: 'Our collections reflect modern fashion.' },
  { title: 'Delivery', text: 'Free Delivery all across India' },
  { title: 'Quality', text: 'We deliver products with high quality fabrics' },
  { title: 'Showroom', text: 'You can see our latest collection here' },
]

export const instagramPosts = [
  { id: 1, caption: 'Grace never goes out of style', image: `${BF}/2026/03/prod-2.png` },
  { id: 2, caption: 'Elegance woven with tradition', image: `${BF}/2026/03/1.png` },
  { id: 3, caption: 'Sophisticated craftsmanship meets everyday elegance', image: kurtaCoordCategoryImage },
  { id: 4, caption: 'Elegance in Every Thread', image: `${BF}/2026/03/4.png` },
  { id: 5, caption: 'Sunshine, style, and timeless elegance', image: `${BF}/2026/03/home-ban-2.png` },
  { id: 6, caption: 'Heritage meets contemporary', image: dressCategoryImage },
]

export const categoryCards = [
  { label: 'Dresses', count: dressProducts.length, image: dressCategoryImage, href: '/dress/one-piece' },
  { label: 'Kurta Set / Coord Set', count: kurtaCoordProducts.length, image: kurtaCoordCategoryImage, href: '/dress/two-piece' },
  { label: 'Blouse', count: blouseProducts.length, image: blouseCategoryImage, href: '/blouse' },
  { label: "Men's", count: mensProducts.length, image: mensCategoryImage, href: '/mens' },
]

export const brandAssets = {
  logo: `${BF}/2026/02/Boutique-Fashion_-New-Logo_V4.png`,
  newArrivalsBanner: `${BF}/2026/03/home-ban-2.png`,
  mensExclusiveBanner,
}
