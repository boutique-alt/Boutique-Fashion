import { blouseProducts } from './blouseProducts'
import { dressCategoryImage, dressProducts } from './dressProducts'
import { kurtaCoordCategoryImage, kurtaCoordProducts } from './kurtaCoordProducts'
import { mensExclusiveBanner, mensProducts } from './mensProducts'

const BF = 'https://boutiquefashion.shop/wp-content/uploads'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  href?: string
  isNew?: boolean
  onSale?: boolean
  isBestSeller?: boolean
  newArrivalVideo?: string
}

const onePiece: Product[] = dressProducts

const coordSets: Product[] = kurtaCoordProducts.filter(
  (p) =>
    p.name.toLowerCase().includes('coord') ||
    p.name.toLowerCase().includes('skirt') ||
    p.name.toLowerCase().includes('pant'),
)

const kurtaSets: Product[] = kurtaCoordProducts.filter((p) => !coordSets.includes(p))

const blouse: Product[] = blouseProducts

const mens: Product[] = mensProducts

export const bestSellerProducts: Record<string, Product[]> = {
  'ONE PIECE': onePiece,
  'KURTA SET': kurtaSets,
  'COORD SET': coordSets,
  BLOUSE: blouse,
}

export const exclusiveCollectionProducts: Product[] = [
  onePiece[0],
  kurtaCoordProducts[0],
  onePiece[1],
  kurtaCoordProducts[9],
  blouse[0],
  kurtaCoordProducts[10],
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
    tag: 'Exclusive Collections',
    title: 'Premium Kurtis &',
    subtitle: 'Indo-Western Collection',
    description:
      'Discover breathable kurtis, elegant indo-western outfits, and ready-to-wear sarees designed for modern women.',
    image: '/images/assets/hero-banner-1.jpg',
    cta: 'Explore Collection',
    href: '/dress/one-piece',
    bgColor: '#e8d9d0',
  },
  {
    tag: 'Exclusive Collections',
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
  { id: 1, caption: 'Grace never goes out of style', image: dressCategoryImage },
  { id: 2, caption: 'Elegance woven with tradition', image: kurtaCoordCategoryImage },
  { id: 3, caption: 'Sophisticated craftsmanship meets everyday elegance', image: blouseProducts[0]?.image || dressCategoryImage },
  { id: 4, caption: 'Elegance in Every Thread', image: mensProducts[0]?.image || kurtaCoordCategoryImage },
  { id: 5, caption: 'Sunshine, style, and timeless elegance', image: dressProducts[1]?.image || dressCategoryImage },
  { id: 6, caption: 'Heritage meets contemporary', image: kurtaCoordProducts[2]?.image || kurtaCoordCategoryImage },
]

export const brandAssets = {
  logo: '/images/assets/logo.jpg',
  newArrivalsBanner: '/images/assets/home-ban-2.png',
  mensExclusiveBanner,
}
