import type { Product } from './products'
import { allCategories } from './categories'
import { slugFromHref } from '../utils/productSlug'
import {
  getAdminProducts,
  getDeletedSlugs,
  getProductOverrides,
} from '../services/productService'
import type { AdminProduct } from '../types/adminProduct'

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
  source?: 'static' | 'admin'
  adminId?: string
}


function hdImage(image: string): string {
  if (image.startsWith('/images/')) return image
  return image.replace('-480x638', '-800x800')
}

function galleryImages(image: string): string[] {
  if (image.startsWith('/images/')) return [image]
  const primary = hdImage(image)
  const alt = image.includes('1-480x638') || image.includes('1.png')
    ? primary
    : hdImage(image.replace('-480x638', '1-480x638').replace('.png', '1.png').replace(/1\.png$/, '1-480x638.png'))
  if (alt === primary) return [primary]
  return [primary, alt]
}

const extraDetails: Record<string, Partial<Omit<ProductDetail, keyof Product | 'slug'>>> = {}

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

function adminToDetail(product: AdminProduct): ProductDetail {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    onSale: product.onSale,
    isNew: product.isNew,
    slug: product.slug,
    images: [product.image],
    shortDescription: product.shortDescription,
    description: product.description,
    sizes: product.sizes,
    categorySlug: product.categorySlug,
    categoryLabel: product.categoryLabel,
    categoryPath: product.categoryPath,
    source: 'admin',
    adminId: product.id,
  }
}

function applyOverride(product: ProductDetail, override: ReturnType<typeof getProductOverrides>[string]): ProductDetail {
  if (!override) return product
  const merged = { ...product, ...override }
  if (override.image) {
    merged.images = [override.image]
    merged.image = override.image
  }
  if (override.categorySlug) {
    const cat = allCategories.find((c) => c.slug === override.categorySlug)
    if (cat) {
      merged.categorySlug = cat.slug
      merged.categoryLabel = cat.title
      merged.categoryPath = cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`
    }
  }
  return merged
}

function getCatalog(): ProductDetail[] {
  const deleted = new Set(getDeletedSlugs())
  const overrides = getProductOverrides()

  const staticProducts = buildCatalog()
    .filter((p) => !deleted.has(p.slug))
    .map((p) => {
      const o = overrides[p.slug]
      if (!o) return { ...p, source: 'static' as const }
      return applyOverride({ ...p, source: 'static' as const }, o)
    })

  const adminProducts = getAdminProducts().map(adminToDetail)
  return [...staticProducts, ...adminProducts]
}

export function getAllProductDetails(): ProductDetail[] {
  return getCatalog()
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return getCatalog().find((p) => p.slug === slug)
}

export function getRelatedProducts(product: ProductDetail, limit = 8): ProductDetail[] {
  const catalog = getCatalog()
  return catalog
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit)
}

export function getAdjacentProducts(slug: string): { prev?: ProductDetail; next?: ProductDetail } {
  const catalog = getCatalog()
  const idx = catalog.findIndex((p) => p.slug === slug)
  if (idx < 0) return {}
  return {
    prev: idx > 0 ? catalog[idx - 1] : undefined,
    next: idx < catalog.length - 1 ? catalog[idx + 1] : undefined,
  }
}

export function searchProducts(query: string): ProductDetail[] {
  const catalog = getCatalog()
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
  const catalog = getCatalog()
  return slugs
    .map((slug) => catalog.find((p) => p.slug === slug))
    .filter((p): p is ProductDetail => !!p)
}
