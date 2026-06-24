import { allCategories } from '../data/categories'
import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { mapOverrides, mapProduct, productToDb, type DbProduct } from '../lib/supabaseMappers'
import type { AdminProduct, AdminProductInput, ProductOverride } from '../types/adminProduct'
import { hasSupabaseAdminSession } from './adminService'
import { createId, loadStore, saveStore } from './storage'

const PRODUCTS_KEY = 'admin-products'
const DELETED_KEY = 'deleted-product-slugs'
const OVERRIDES_KEY = 'product-overrides'

let productsCache: AdminProduct[] | null = null
let deletedCache: string[] | null = null
let overridesCache: Record<string, ProductOverride> | null = null

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function categoryMeta(categorySlug: string) {
  const cat = allCategories.find((c) => c.slug === categorySlug)
  if (!cat) {
    return { categoryLabel: categorySlug, categoryPath: '/dress' }
  }
  const categoryPath = cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`
  return { categoryLabel: cat.title, categoryPath }
}

function getAdminProductsLocal(): AdminProduct[] {
  return loadStore<AdminProduct[]>(PRODUCTS_KEY, [])
}

function getDeletedSlugsLocal(): string[] {
  return loadStore<string[]>(DELETED_KEY, [])
}

function getProductOverridesLocal(): Record<string, ProductOverride> {
  return loadStore<Record<string, ProductOverride>>(OVERRIDES_KEY, {})
}

function mergeAdminProducts(remote: AdminProduct[], local: AdminProduct[]): AdminProduct[] {
  const remoteIds = new Set(remote.map((p) => p.id))
  const localOnly = local.filter((p) => !remoteIds.has(p.id))
  return [...remote, ...localOnly]
}

function saveAdminProductLocal(product: AdminProduct): void {
  const local = getAdminProductsLocal().filter((p) => p.id !== product.id)
  saveStore(PRODUCTS_KEY, [product, ...local])
}

export async function hydrateProductStore(): Promise<void> {
  if (!isSupabaseConfigured()) {
    productsCache = getAdminProductsLocal()
    deletedCache = getDeletedSlugsLocal()
    overridesCache = getProductOverridesLocal()
    return
  }

  const client = getSupabase()
  const [productsRes, hiddenRes, overridesRes] = await Promise.all([
    client.from('products').select('*').order('created_at', { ascending: false }),
    client.from('catalog_hidden_slugs').select('slug'),
    client.from('catalog_overrides').select('slug, override_data'),
  ])

  const remote = productsRes.data ? (productsRes.data as DbProduct[]).map(mapProduct) : []
  productsCache = mergeAdminProducts(remote, getAdminProductsLocal())
  deletedCache = hiddenRes.data ? hiddenRes.data.map((r: { slug: string }) => r.slug) : []
  overridesCache = overridesRes.data
    ? mapOverrides(overridesRes.data as { slug: string; override_data: ProductOverride }[])
    : {}
}

export function getAdminProducts(): AdminProduct[] {
  if (productsCache) return productsCache
  if (!isSupabaseConfigured()) return getAdminProductsLocal()
  return getAdminProductsLocal()
}

export function getDeletedSlugs(): string[] {
  if (deletedCache) return deletedCache
  if (!isSupabaseConfigured()) return getDeletedSlugsLocal()
  return []
}

export function getProductOverrides(): Record<string, ProductOverride> {
  if (overridesCache) return overridesCache
  if (!isSupabaseConfigured()) return getProductOverridesLocal()
  return {}
}

function uniqueSlug(base: string, excludeId?: string): string {
  const products = getAdminProducts()
  const deleted = getDeletedSlugs()
  let slug = base
  let i = 1
  while (
    products.some((p) => p.slug === slug && p.id !== excludeId) ||
    deleted.includes(slug)
  ) {
    slug = `${base}-${i++}`
  }
  return slug
}

export async function createAdminProduct(input: AdminProductInput): Promise<AdminProduct> {
  const baseSlug = slugify(input.name) || 'product'
  const slug = uniqueSlug(baseSlug)
  const meta = categoryMeta(input.categorySlug)
  const now = new Date().toISOString()

  if (!isSupabaseConfigured()) {
    const product: AdminProduct = {
      id: createId(),
      slug,
      ...input,
      ...meta,
      createdAt: now,
      updatedAt: now,
    }
    saveStore(PRODUCTS_KEY, [...getAdminProductsLocal(), product])
    productsCache = [...(productsCache ?? getAdminProductsLocal()), product]
    return product
  }

  const row = productToDb({ slug, ...input, ...meta })
  const id = crypto.randomUUID()
  const product: AdminProduct = {
    id,
    slug,
    ...input,
    ...meta,
    createdAt: now,
    updatedAt: now,
  }

  if (await hasSupabaseAdminSession()) {
    const { error } = await getSupabaseAdmin().from('products').insert({
      ...row,
      id,
      created_at: now,
      updated_at: now,
    })
    if (!error) {
      productsCache = [product, ...(productsCache ?? [])]
      return product
    }
  }

  saveAdminProductLocal(product)
  productsCache = [product, ...(productsCache ?? getAdminProductsLocal())]
  return product
}

export async function updateAdminProduct(id: string, input: AdminProductInput): Promise<AdminProduct | null> {
  const products = getAdminProducts()
  const existing = products.find((p) => p.id === id)
  if (!existing) return null

  const baseSlug = slugify(input.name) || existing.slug
  const slug = input.name !== existing.name ? uniqueSlug(baseSlug, id) : existing.slug
  const meta = categoryMeta(input.categorySlug)
  const now = new Date().toISOString()

  if (!isSupabaseConfigured()) {
    const local = getAdminProductsLocal()
    const index = local.findIndex((p) => p.id === id)
    if (index < 0) return null
    const updated: AdminProduct = { ...existing, ...input, ...meta, slug, updatedAt: now }
    local[index] = updated
    saveStore(PRODUCTS_KEY, local)
    productsCache = local
    return updated
  }

  const updated: AdminProduct = { ...existing, ...input, ...meta, slug, updatedAt: now }

  if (await hasSupabaseAdminSession()) {
    const row = {
      ...productToDb({ ...existing, ...input, ...meta, slug }),
      updated_at: now,
    }
    const { error } = await getSupabaseAdmin().from('products').update(row).eq('id', id)
    if (!error) {
      productsCache = (productsCache ?? []).map((p) => (p.id === id ? updated : p))
      return updated
    }
  }

  saveAdminProductLocal(updated)
  productsCache = (productsCache ?? getAdminProductsLocal()).map((p) => (p.id === id ? updated : p))
  return updated
}

export async function deleteAdminProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const filtered = getAdminProductsLocal().filter((p) => p.id !== id)
    saveStore(PRODUCTS_KEY, filtered)
    productsCache = filtered
    return
  }

  if (await hasSupabaseAdminSession()) {
    await getSupabaseAdmin().from('products').delete().eq('id', id)
  }

  const filtered = getAdminProductsLocal().filter((p) => p.id !== id)
  saveStore(PRODUCTS_KEY, filtered)
  productsCache = (productsCache ?? []).filter((p) => p.id !== id)
}

export async function deleteStaticProduct(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const deleted = getDeletedSlugsLocal()
    if (!deleted.includes(slug)) {
      saveStore(DELETED_KEY, [...deleted, slug])
    }
    deletedCache = [...(deletedCache ?? deleted), slug]
    return
  }

  await getSupabase().from('catalog_hidden_slugs').upsert({ slug })
  deletedCache = deletedCache?.includes(slug) ? deletedCache : [...(deletedCache ?? []), slug]
}

export async function saveStaticProductOverride(slug: string, input: AdminProductInput): Promise<void> {
  const override: ProductOverride = { ...input }

  if (!isSupabaseConfigured()) {
    const overrides = getProductOverridesLocal()
    overrides[slug] = override
    saveStore(OVERRIDES_KEY, overrides)
    overridesCache = overrides
    return
  }

  await getSupabase().from('catalog_overrides').upsert({
    slug,
    override_data: override,
    updated_at: new Date().toISOString(),
  })
  overridesCache = { ...(overridesCache ?? {}), [slug]: override }
}

export async function restoreStaticProduct(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveStore(DELETED_KEY, getDeletedSlugsLocal().filter((s) => s !== slug))
    const overrides = getProductOverridesLocal()
    delete overrides[slug]
    saveStore(OVERRIDES_KEY, overrides)
    deletedCache = (deletedCache ?? []).filter((s) => s !== slug)
    const next = { ...(overridesCache ?? {}) }
    delete next[slug]
    overridesCache = next
    return
  }

  await Promise.all([
    getSupabase().from('catalog_hidden_slugs').delete().eq('slug', slug),
    getSupabase().from('catalog_overrides').delete().eq('slug', slug),
  ])
  deletedCache = (deletedCache ?? []).filter((s) => s !== slug)
  const next = { ...(overridesCache ?? {}) }
  delete next[slug]
  overridesCache = next
}

export const adminCategoryOptions = allCategories.map((c) => ({
  slug: c.slug,
  label: c.title,
}))
