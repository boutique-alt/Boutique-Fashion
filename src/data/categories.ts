import type { Product } from './products'
import { blouseProducts } from './blouseProducts'
import { dressProducts } from './dressProducts'
import { kurtaCoordProducts } from './kurtaCoordProducts'
import { mensProducts } from './mensProducts'
import { suitSetProducts } from './suitSetProducts'
import { topsPantProducts, topsSkirtProducts } from './topsPantSkirtProducts'

export interface CategoryConfig {
  slug: string
  title: string
  description: string
  count: number
  products: Product[]
  parent: { label: string; href: string }
}

const onePiece: Product[] = dressProducts

const coordSets: Product[] = kurtaCoordProducts.filter(
  (p) =>
    p.name.toLowerCase().includes('coord') ||
    p.name.toLowerCase().includes('skirt') ||
    p.name.toLowerCase().includes('pant'),
)

const kurtaSets: Product[] = kurtaCoordProducts.filter((p) => !coordSets.includes(p))

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
    slug: 'kurta-set',
    title: 'Kurta Set',
    description: 'Elegant kurta sets for effortless ethnic style.',
    count: kurtaSets.length,
    products: kurtaSets,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'coord-set',
    title: 'Coord Set',
    description: 'Coordinated crop tops, skirts and pants sets for contemporary style.',
    count: coordSets.length,
    products: coordSets,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'tops-pant',
    title: 'Tops with Pant',
    description: 'Stylish tops paired with pants for versatile everyday and festive looks.',
    count: topsPantProducts.length,
    products: topsPantProducts,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'tops-skirt',
    title: 'Tops with Skirt',
    description: 'Stylish tops paired with skirts for versatile everyday and festive looks.',
    count: topsSkirtProducts.length,
    products: topsSkirtProducts,
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
  {
    slug: 'fabric',
    title: 'Fabric',
    description: 'Premium fabrics, handloom cottons, chanderi silks and modal textiles.',
    count: 0,
    products: [],
    parent: { label: 'Collection', href: '/fabric' },
  },
  {
    slug: 'bridal',
    title: 'Bridal',
    description: 'Designer bridal wear and luxury occasion sets.',
    count: 0,
    products: [],
    parent: { label: 'Collection', href: '/bridal' },
  },
  {
    slug: 'groom',
    title: 'Groom',
    description: 'Premium sherwanis and silk ethnic wear for grooms.',
    count: 0,
    products: [],
    parent: { label: 'Collection', href: '/bridal/groom' },
  },
 ]
 
 export const dressCategories = allCategories.filter((c) =>
   c.slug === 'one-piece' || c.slug === 'kurta-set' || c.slug === 'coord-set' || c.slug === 'tops-pant' || c.slug === 'tops-skirt',
 )

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return allCategories.find((c) => c.slug === slug)
}

export const collectionLandingCategories = allCategories.filter((c) =>
  ['mens', 'blouse', 'three-piece'].includes(c.slug),
)
