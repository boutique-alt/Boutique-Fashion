import type { Product } from './products'
import { blouseProducts } from './blouseProducts'
import { dressProducts } from './dressProducts'
import { kurtaCoordProducts } from './kurtaCoordProducts'
import { mensProducts } from './mensProducts'
import { suitSetProducts } from './suitSetProducts'
import { topsPantSkirtProducts } from './topsPantSkirtProducts'

export interface CategoryConfig {
  slug: string
  title: string
  description: string
  count: number
  products: Product[]
  parent: { label: string; href: string }
}

const onePiece: Product[] = dressProducts

const twoPiece: Product[] = kurtaCoordProducts

const mens: Product[] = mensProducts

const blouse: Product[] = blouseProducts

const threePiece: Product[] = suitSetProducts

export const allCategories: CategoryConfig[] = [
  {
    slug: 'one-piece',
    title: 'Dresses',
    description: 'Elegant dresses crafted with premium fabrics and artisanal details.',
    count: dressProducts.length,
    products: onePiece,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'two-piece',
    title: 'Kurta Set / Coord Set',
    description: 'Coordinated kurta sets and coord sets for effortless ethnic elegance.',
    count: kurtaCoordProducts.length,
    products: twoPiece,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'tops-pant-skirt',
    title: 'Tops with Pant / Skirt',
    description: 'Stylish tops paired with pants and skirts for versatile everyday and festive looks.',
    count: topsPantSkirtProducts.length,
    products: topsPantSkirtProducts,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'mens',
    title: "Men's",
    description: 'Premium ethnic and contemporary shirts designed for modern men with timeless taste.',
    count: mensProducts.length,
    products: mens,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'blouse',
    title: 'Blouse',
    description: 'Designer blouses crafted in katan silk and brocade for weddings and celebrations.',
    count: blouseProducts.length,
    products: blouse,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'three-piece',
    title: 'Suit Set',
    description: 'Elegant suit sets with artisanal detailing for festive occasions.',
    count: suitSetProducts.length,
    products: threePiece,
    parent: { label: 'Collection', href: '/dress' },
  },
]

export const dressCategories = allCategories.filter((c) =>
  c.slug === 'one-piece' || c.slug === 'two-piece' || c.slug === 'tops-pant-skirt',
)

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return allCategories.find((c) => c.slug === slug)
}

export const collectionLandingCategories = allCategories.filter((c) =>
  ['mens', 'blouse', 'three-piece'].includes(c.slug),
)
