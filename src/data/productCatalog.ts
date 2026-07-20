import type { Product } from './products'
import { allCategories } from './categories'
import { slugFromHref } from '../utils/productSlug'
import {
  getAdminProducts,
  getCatalogVersion,
  getDeletedSlugs,
  getProductOverrides,
} from '../services/productService'
import type { AdminProduct, ProductAddon } from '../types/adminProduct'

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
  productDetails?: Record<string, string>
  addons?: ProductAddon[]
  sku?: string
  stockQuantity?: number
  shopCategorySelections?: string[]
  source?: 'static' | 'admin'
  adminId?: string
  additionalImages?: string[]
}


function hdImage(image: string): string {
  if (image.startsWith('/images/')) return image
  return image.replace('-480x638', '-800x800')
}

function galleryImages(image: string): string[] {
  if (image.startsWith('/images/')) return [image]
  const primary = hdImage(image)
  const alt = image.includes('1-480x638') || image.includes('1.webp')
    ? primary
    : hdImage(image.replace('-480x638', '1-480x638').replace('.webp', '1.webp').replace(/1\.webp$/, '1-480x638.webp'))
  if (alt === primary) return [primary]
  return [primary, alt]
}

const extraDetails: Record<string, Partial<Omit<ProductDetail, 'slug' | 'id' | 'name' | 'price' | 'originalPrice' | 'image' | 'href' | 'isNew' | 'onSale'>>> = {}

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
        stockQuantity: extra.stockQuantity ?? 10, // Default for static products
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
    isBestSeller: product.isBestSeller,
    newArrivalVideo: product.newArrivalVideo,
    slug: product.slug,
    images: product.additionalImages && product.additionalImages.length > 0 
      ? [product.image, ...product.additionalImages] 
      : [product.image],
    shortDescription: product.shortDescription,
    description: product.description,
    sizes: product.sizes,
    categorySlug: product.categorySlug,
    categoryLabel: product.categoryLabel,
    categoryPath: product.categoryPath,
    fabric: product.fabric,
    washCare: product.washCare,
    productDetails: product.productDetails,
    addons: product.addons,
    sku: product.sku,
    stockQuantity: product.stockQuantity,
    shopCategorySelections: product.shopCategorySelections,
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
  if (override.stockQuantity !== undefined) {
    merged.stockQuantity = override.stockQuantity
  }
  return merged
}

let cachedCatalog: ProductDetail[] | null = null
let cachedVersion = -1

function getCatalog(): ProductDetail[] {
  const version = getCatalogVersion()
  if (cachedCatalog && cachedVersion === version) {
    return cachedCatalog
  }

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
  cachedCatalog = [...staticProducts, ...adminProducts]
  cachedVersion = version
  return cachedCatalog
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
