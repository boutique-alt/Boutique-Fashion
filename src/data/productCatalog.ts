import type { Product } from './products'
import { allCategories } from './categories'
import { slugFromHref } from '../utils/productSlug'

export interface ProductDetail extends Product {
  slug: string
  images: string[]
  shortDescription: string
  description: string
  sizes: string[]
  categorySlug: string
  categoryLabel: string
  categoryPath: string
  fabric?: string
  washCare?: string[]
}

const BF = 'https://boutiquefashion.shop/wp-content/uploads'

function hdImage(image: string): string {
  return image.replace('-480x638', '-800x800')
}

function galleryImages(image: string): string[] {
  const primary = hdImage(image)
  const alt = image.includes('1-480x638') || image.includes('1.png')
    ? primary
    : hdImage(image.replace('-480x638', '1-480x638').replace('.png', '1.png').replace(/1\.png$/, '1-480x638.png'))
  if (alt === primary) return [primary]
  return [primary, alt]
}

const extraDetails: Record<string, Partial<Omit<ProductDetail, keyof Product | 'slug'>>> = {
  'maroon-heritage-handblock-cotton-midi-dress': {
    images: [
      `${BF}/2026/03/Handblock-Pure-Cotton-Maroon-One-Piece-800x800.png`,
      `${BF}/2026/03/Handblock-Pure-Cotton-Maroon-One-Piece1-800x800.png`,
    ],
    shortDescription:
      'A graceful maroon heritage handblock cotton midi dress featuring traditional floral prints and elegant panel detailing. Crafted from soft breathable cotton, it offers a perfect blend of comfort, artisanal charm, and timeless everyday style.',
    description: `The Maroon Heritage Handblock Cotton Midi Dress beautifully celebrates traditional Indian craftsmanship with a contemporary silhouette. Made from pure breathable cotton, the dress is designed for comfort while showcasing intricate handblock floral motifs that reflect the beauty of heritage textile artistry.

The rich maroon panel detailing creates a striking contrast with the delicate floral prints, adding depth and sophistication to the design. The flattering midi length and structured silhouette enhance the overall elegance, making it suitable for casual outings, cultural gatherings, or relaxed festive occasions.

Thoughtfully crafted for modern wardrobes, this dress blends heritage craftsmanship with effortless everyday elegance, making it a versatile and timeless addition to your collection.`,
    fabric: 'Pure Handblock Printed Cotton — soft, breathable, and lightweight fabric',
    washCare: [
      'Gentle hand wash recommended',
      'Use mild detergent',
      'Do not bleach',
      'Dry in shade',
      'Iron on medium heat',
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
  },
}

function defaultDescription(name: string): string {
  return `${name} from Boutique Fashion is thoughtfully crafted with premium fabrics and artisanal detailing. Designed for comfort and elegance, this piece blends modern style with timeless Indian craftsmanship — perfect for everyday wear and special occasions alike.`
}

function buildCatalog(): ProductDetail[] {
  const catalog: ProductDetail[] = []

  for (const cat of allCategories) {
    const categoryPath = cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`

    for (const product of cat.products) {
      const slug = slugFromHref(product.href)
      const extra = extraDetails[slug] ?? {}

      catalog.push({
        ...product,
        slug,
        categorySlug: cat.slug,
        categoryLabel: cat.title,
        categoryPath,
        images: extra.images ?? galleryImages(product.image),
        shortDescription: extra.shortDescription ?? `Premium ${product.name} crafted with quality fabrics and elegant design.`,
        description: extra.description ?? defaultDescription(product.name),
        sizes: extra.sizes ?? ['M', 'L', 'XL', '2XL'],
        fabric: extra.fabric,
        washCare: extra.washCare,
      })
    }
  }

  return catalog
}

const catalog = buildCatalog()

export function getAllProductDetails(): ProductDetail[] {
  return catalog
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return catalog.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: ProductDetail, limit = 8): ProductDetail[] {
  return catalog
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit)
}

export function getAdjacentProducts(slug: string): { prev?: ProductDetail; next?: ProductDetail } {
  const idx = catalog.findIndex((p) => p.slug === slug)
  if (idx < 0) return {}
  return {
    prev: idx > 0 ? catalog[idx - 1] : undefined,
    next: idx < catalog.length - 1 ? catalog[idx + 1] : undefined,
  }
}

export function searchProducts(query: string): ProductDetail[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return catalog.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q),
  )
}

export function getProductsBySlugs(slugs: string[]): ProductDetail[] {
  return slugs
    .map((slug) => catalog.find((p) => p.slug === slug))
    .filter((p): p is ProductDetail => !!p)
}
