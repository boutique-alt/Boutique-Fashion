import { allCategories } from '../data/categories'
import { LEGACY_SHOP_CATEGORY_IDS } from '../data/shopCategories'
import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { mapOverrides, mapProduct, productToDb, type DbProduct } from '../lib/supabaseMappers'
import type { AdminProduct, AdminProductInput, ProductOverride } from '../types/adminProduct'
import { syncSupabaseAdminSession } from './adminService'

const catalogListeners = new Set<() => void>()
let catalogVersion = 0

const catalogChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('bf-catalog')
  : null

if (catalogChannel) {
  catalogChannel.onmessage = () => {
    void hydrateProductStore()
  }
}

export function getCatalogVersion(): number {
  return catalogVersion
}

export function subscribeProductCatalog(listener: () => void): () => void {
  catalogListeners.add(listener)
  return () => catalogListeners.delete(listener)
}

function notifyCatalogChanged(broadcast = true): void {
  catalogVersion += 1
  catalogListeners.forEach((listener) => listener())
  if (broadcast) {
    catalogChannel?.postMessage(catalogVersion)
  }
}

async function requireAdminCloudSession(): Promise<void> {
  const sync = await syncSupabaseAdminSession()
  if (!sync.ok) {
    throw new Error(sync.error ?? 'Could not sign in to Supabase as admin. Changes were not saved.')
  }
}

let productsCache: AdminProduct[] | null = null
let deletedCache: string[] | null = null
let overridesCache: Record<string, ProductOverride> | null = null
let lastHydrationError: string | undefined

const PRODUCTS_PAGE_SIZE = 1000

export interface CatalogHydrationResult {
  ok: boolean
  error?: string
  adminProductCount: number
}

export function getLastCatalogHydrationError(): string | undefined {
  return lastHydrationError
}

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
  if (!isSupabaseConfigured()) return

  const selected = new Set(selectedIds.map(normalizeShopCategoryId))
  if (selected.size === 0) return

  const now = new Date().toISOString()

  for (const product of getAdminProducts()) {
    if (isShopCategoryOwner(product.slug, product.id, owner)) continue
    const current = product.shopCategorySelections ?? []
    const next = current.filter((id) => !selected.has(normalizeShopCategoryId(id)))
    if (next.length === current.length) continue

    const updated: AdminProduct = { ...product, shopCategorySelections: next, updatedAt: now }

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

async function fetchAllProducts(): Promise<{ rows: DbProduct[]; error?: string }> {
  const client = getSupabase()
  const rows: DbProduct[] = []
  let from = 0

  while (true) {
    const { data, error } = await client
      .from('products')
      .select('id, slug, name, price, original_price, image, additional_images, category_slug, category_label, category_path, is_new, is_best_seller, on_sale, shop_category_selections, stock_quantity, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(from, from + PRODUCTS_PAGE_SIZE - 1)

    if (error) return { rows: [], error: error.message }
    if (!data?.length) break

    rows.push(...(data as DbProduct[]))
    if (data.length < PRODUCTS_PAGE_SIZE) break
    from += PRODUCTS_PAGE_SIZE
  }

  return { rows }
}

export async function hydrateProductStore(): Promise<CatalogHydrationResult> {
  if (!isSupabaseConfigured()) {
    productsCache = []
    deletedCache = []
    overridesCache = {}
    lastHydrationError = import.meta.env.PROD
      ? 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel, then redeploy.'
      : undefined
    notifyCatalogChanged(false)
    return { ok: !lastHydrationError, error: lastHydrationError, adminProductCount: 0 }
  }

  const client = getSupabase()
  const [productsRes, hiddenRes, overridesRes] = await Promise.all([
    fetchAllProducts(),
    client.from('catalog_hidden_slugs').select('slug'),
    client.from('catalog_overrides').select('slug, override_data'),
  ])

  const errors = [
    productsRes.error,
    hiddenRes.error?.message,
    overridesRes.error?.message,
  ].filter(Boolean) as string[]

  if (errors.length > 0) {
    lastHydrationError = errors.join('; ')
    console.error('[catalog] hydration failed:', lastHydrationError)
    notifyCatalogChanged(false)
    return {
      ok: false,
      error: lastHydrationError,
      adminProductCount: productsCache?.length ?? 0,
    }
  }

  productsCache = productsRes.rows.map(mapProduct)
  deletedCache = hiddenRes.data ? hiddenRes.data.map((r: { slug: string }) => r.slug) : []
  overridesCache = overridesRes.data
    ? mapOverrides(overridesRes.data as { slug: string; override_data: ProductOverride }[])
    : {}
  lastHydrationError = undefined
  notifyCatalogChanged(false)
  return { ok: true, adminProductCount: productsCache.length }
}

export function getAdminProducts(): AdminProduct[] {
  return productsCache ?? []
}

export function getDeletedSlugs(): string[] {
  return deletedCache ?? []
}

export function getProductOverrides(): Record<string, ProductOverride> {
  return overridesCache ?? {}
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
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const baseSlug = slugify(input.name) || 'product'
  const slug = uniqueSlug(baseSlug)
  const meta = categoryMeta(input.categorySlug)
  const now = new Date().toISOString()

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
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const products = getAdminProducts()
  const existing = products.find((p) => p.id === id)
  if (!existing) return null

  const baseSlug = slugify(input.name) || existing.slug
  const slug = input.name !== existing.name ? uniqueSlug(baseSlug, id) : existing.slug
  const meta = categoryMeta(input.categorySlug)
  const now = new Date().toISOString()
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
    throw new Error('Supabase is not configured')
  }

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)

  productsCache = (productsCache ?? []).filter((p) => p.id !== id)
  notifyCatalogChanged()
}

export async function deleteStaticProduct(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  await requireAdminCloudSession()
  const { error } = await getSupabaseAdmin().from('catalog_hidden_slugs').upsert({ slug })
  if (error) throw new Error(error.message)

  deletedCache = deletedCache?.includes(slug) ? deletedCache : [...(deletedCache ?? []), slug]
  notifyCatalogChanged()
}

export async function saveStaticProductOverride(slug: string, input: AdminProductInput): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const override: ProductOverride = { ...input }

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
    throw new Error('Supabase is not configured')
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

const adminCategoryLabels: Record<string, string> = {
  'one-piece': 'Dresses',
  'kurta-set': 'Kurta Set',
  'coord-set': 'Coord Set',
  'tops-pant-skirt': 'Tops with Pant / Skirt',
  blouse: 'Blouse',
  mens: "Men's",
  'three-piece': 'Suit Set',
  fabric: 'Fabric',
  bridal: 'Bridal',
}

export const adminCategoryOptions = allCategories.map((cat) => ({
  slug: cat.slug,
  label: adminCategoryLabels[cat.slug] ?? cat.title,
}))

export async function fetchProductDetails(slugOrId: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const client = getSupabase()
  const isId = slugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  
  const { data, error } = await client
    .from('products')
    .select('id, description, short_description, sizes, fabric, wash_care, product_details')
    .eq(isId ? 'id' : 'slug', slugOrId)
    .maybeSingle()

  if (error || !data) return

  if (productsCache) {
    productsCache = productsCache.map((p) => {
      if (p.id === data.id || p.slug === slugOrId) {
        return {
          ...p,
          description: data.description ?? p.description,
          shortDescription: data.short_description ?? p.shortDescription,
          sizes: data.sizes ?? p.sizes,
          fabric: data.fabric ?? p.fabric,
          washCare: data.wash_care ?? p.washCare,
          productDetails: data.product_details ?? p.productDetails,
        }
      }
      return p
    })
    notifyCatalogChanged(false)
  }
}

