import { allCategories } from '../data/categories'
import { LEGACY_SHOP_CATEGORY_IDS } from '../data/shopCategories'
import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { mapOverrides, mapProduct, productToDb, type DbProduct } from '../lib/supabaseMappers'
import type { AdminProduct, AdminProductInput, ProductOverride } from '../types/adminProduct'
import { syncSupabaseAdminSession } from './adminService'
import { createId, loadStore, saveStore } from './storage'

const catalogListeners = new Set<() => void>()
let catalogVersion = 0

export function getCatalogVersion(): number {
  return catalogVersion
}

export function subscribeProductCatalog(listener: () => void): () => void {
  catalogListeners.add(listener)
  return () => catalogListeners.delete(listener)
}

function notifyCatalogChanged(): void {
  catalogVersion += 1
  catalogListeners.forEach((listener) => listener())
  try {
    // Triggers `storage` event in other tabs to refresh storefront catalog.
    localStorage.setItem('bf-catalog-bump', String(Date.now()))
  } catch {
    // ignore
  }
}

async function requireAdminCloudSession(): Promise<void> {
  const sync = await syncSupabaseAdminSession()
  if (!sync.ok) {
    throw new Error(sync.error ?? 'Could not sign in to Supabase as admin. Changes were not saved.')
  }
}

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

function normalizeShopCategoryId(id: string): string {
  return LEGACY_SHOP_CATEGORY_IDS[id] ?? id
}

type ShopCategoryOwner = { slug: string; adminId?: string }

function isShopCategoryOwner(
  slug: string,
  adminId: string | undefined,
  owner: ShopCategoryOwner,
): boolean {
  return slug === owner.slug || (!!owner.adminId && adminId === owner.adminId)
}

export async function stripShopCategoriesFromOthers(
  owner: ShopCategoryOwner,
  selectedIds: string[],
): Promise<void> {
  const selected = new Set(selectedIds.map(normalizeShopCategoryId))
  if (selected.size === 0) return

  const now = new Date().toISOString()

  for (const product of getAdminProducts()) {
    if (isShopCategoryOwner(product.slug, product.id, owner)) continue
    const current = product.shopCategorySelections ?? []
    const next = current.filter((id) => !selected.has(normalizeShopCategoryId(id)))
    if (next.length === current.length) continue

    const updated: AdminProduct = { ...product, shopCategorySelections: next, updatedAt: now }

    if (!isSupabaseConfigured()) {
      const local = getAdminProductsLocal()
      const index = local.findIndex((p) => p.id === product.id)
      if (index >= 0) {
        local[index] = updated
        saveStore(PRODUCTS_KEY, local)
        productsCache = local
      }
      notifyCatalogChanged()
      continue
    }

    await requireAdminCloudSession()
    const row = {
      ...productToDb({ ...updated }),
      updated_at: now,
    }
    const { error } = await getSupabaseAdmin().from('products').update(row).eq('id', product.id)
    if (error) throw new Error(error.message)
    productsCache = (productsCache ?? []).map((p) => (p.id === product.id ? updated : p))
    notifyCatalogChanged()
  }

  const overrides = getProductOverrides()
  for (const [slug, override] of Object.entries(overrides)) {
    if (isShopCategoryOwner(slug, undefined, owner)) continue
    const current = override.shopCategorySelections ?? []
    const next = current.filter((id) => !selected.has(normalizeShopCategoryId(id)))
    if (next.length === current.length) continue

    const merged: ProductOverride = { ...override, shopCategorySelections: next }

    if (!isSupabaseConfigured()) {
      const localOverrides = getProductOverridesLocal()
      localOverrides[slug] = merged
      saveStore(OVERRIDES_KEY, localOverrides)
      overridesCache = localOverrides
      notifyCatalogChanged()
      continue
    }

    await requireAdminCloudSession()
    const { error } = await getSupabaseAdmin().from('catalog_overrides').upsert({
      slug,
      override_data: merged,
      updated_at: now,
    })
    if (error) throw new Error(error.message)
    overridesCache = { ...(overridesCache ?? {}), [slug]: merged }
    notifyCatalogChanged()
  }
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

export async function hydrateProductStore(): Promise<void> {
  if (!isSupabaseConfigured()) {
    productsCache = getAdminProductsLocal()
    deletedCache = getDeletedSlugsLocal()
    overridesCache = getProductOverridesLocal()
    notifyCatalogChanged()
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
  notifyCatalogChanged()
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
    notifyCatalogChanged()
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

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('products').insert({
    ...row,
    id,
    created_at: now,
    updated_at: now,
  })
  if (error) throw new Error(error.message)

  productsCache = [product, ...(productsCache ?? [])]
  notifyCatalogChanged()
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
    notifyCatalogChanged()
    return updated
  }

  const updated: AdminProduct = { ...existing, ...input, ...meta, slug, updatedAt: now }

  await requireAdminCloudSession()
  const row = {
    ...productToDb({ ...existing, ...input, ...meta, slug }),
    updated_at: now,
  }
  const { error } = await getSupabaseAdmin().from('products').update(row).eq('id', id)
  if (error) throw new Error(error.message)

  productsCache = (productsCache ?? []).map((p) => (p.id === id ? updated : p))
  notifyCatalogChanged()
  return updated
}

export async function deleteAdminProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const filtered = getAdminProductsLocal().filter((p) => p.id !== id)
    saveStore(PRODUCTS_KEY, filtered)
    productsCache = filtered
    notifyCatalogChanged()
    return
  }

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)

  productsCache = (productsCache ?? []).filter((p) => p.id !== id)
  notifyCatalogChanged()
}

export async function deleteStaticProduct(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const deleted = getDeletedSlugsLocal()
    if (!deleted.includes(slug)) {
      saveStore(DELETED_KEY, [...deleted, slug])
    }
    deletedCache = [...(deletedCache ?? deleted), slug]
    notifyCatalogChanged()
    return
  }

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('catalog_hidden_slugs').upsert({ slug })
  if (error) throw new Error(error.message)

  deletedCache = deletedCache?.includes(slug) ? deletedCache : [...(deletedCache ?? []), slug]
  notifyCatalogChanged()
}

export async function saveStaticProductOverride(slug: string, input: AdminProductInput): Promise<void> {
  const override: ProductOverride = { ...input }

  if (!isSupabaseConfigured()) {
    const overrides = getProductOverridesLocal()
    overrides[slug] = override
    saveStore(OVERRIDES_KEY, overrides)
    overridesCache = overrides
    notifyCatalogChanged()
    return
  }

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('catalog_overrides').upsert({
    slug,
    override_data: override,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)

  overridesCache = { ...(overridesCache ?? {}), [slug]: override }
  notifyCatalogChanged()
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
    notifyCatalogChanged()
    return
  }

  await requireAdminCloudSession()
  const [hiddenRes, overridesRes] = await Promise.all([
    getSupabaseAdmin().from('catalog_hidden_slugs').delete().eq('slug', slug),
    getSupabaseAdmin().from('catalog_overrides').delete().eq('slug', slug),
  ])
  if (hiddenRes.error) throw new Error(hiddenRes.error.message)
  if (overridesRes.error) throw new Error(overridesRes.error.message)

  deletedCache = (deletedCache ?? []).filter((s) => s !== slug)
  const next = { ...(overridesCache ?? {}) }
  delete next[slug]
  overridesCache = next
  notifyCatalogChanged()
}

export const adminCategoryOptions = [
  { slug: 'one-piece', label: 'Dresses' },
  { slug: 'kurta-set', label: 'Kurta Set' },
  { slug: 'coord-set', label: 'Coord Set' },
  { slug: 'tops-pant-skirt', label: 'Tops with Pant' },
  { slug: 'tops-pant-skirt', label: 'Tops with Skirt' },
  { slug: 'mens', label: 'Grooms' },
  { slug: 'blouse', label: 'Brides' },
  { slug: 'three-piece', label: 'Suit Set' },
  { slug: 'fabric', label: 'Fabric' },
]
