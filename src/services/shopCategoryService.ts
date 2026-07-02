import { defaultSelectedCategorySlugs, LEGACY_SHOP_CATEGORY_IDS, shopCategoryOptions } from '../data/shopCategories'
import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import type { ShopCategory, ShopCategoryConfig, ShopCategoryConfigItem } from '../types/shopCategory'
import type { ProductDetail } from '../data/productCatalog'
import { syncSupabaseAdminSession } from './adminService'
import { loadStore, saveStore } from './storage'

const CONFIG_KEY = 'shop-category-config'
const SELECTED_KEY = 'shop-category-selected'

const listeners = new Set<() => void>()
let configCache: ShopCategoryConfig | null = null

function notifyChanged(): void {
  listeners.forEach((listener) => listener())
  try {
    localStorage.setItem('bf-shop-categories-bump', String(Date.now()))
  } catch {
    // ignore
  }
}

export function subscribeShopCategories(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emptyConfigItem(): ShopCategoryConfigItem {
  return { visible: false }
}

function defaultConfig(): ShopCategoryConfig {
  const config: ShopCategoryConfig = {}
  for (const cat of shopCategoryOptions) {
    config[cat.id] = {
      visible: defaultSelectedCategorySlugs().includes(cat.id),
    }
  }
  return config
}

function normalizeId(id: string): string {
  return LEGACY_SHOP_CATEGORY_IDS[id] ?? id
}

function mergeConfig(remote: ShopCategoryConfig, local: ShopCategoryConfig): ShopCategoryConfig {
  const merged: ShopCategoryConfig = {}
  for (const cat of shopCategoryOptions) {
    const remoteItem = remote[cat.id]
    const localItem = local[cat.id]
    merged[cat.id] = {
      visible: remoteItem?.visible ?? localItem?.visible ?? defaultSelectedCategorySlugs().includes(cat.id),
      image: remoteItem?.image ?? localItem?.image,
    }
  }
  return merged
}

function getConfigLocal(): ShopCategoryConfig {
  const stored = loadStore<ShopCategoryConfig | string[] | Record<string, boolean> | null>(CONFIG_KEY, null)

  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    if ('visible' in (Object.values(stored)[0] ?? {}) || Object.values(stored).some((v) => typeof v === 'object')) {
      return mergeConfig(stored as ShopCategoryConfig, {})
    }

    const legacySelected = loadStore<string[]>(SELECTED_KEY, defaultSelectedCategorySlugs())
    const slugs = Array.isArray(stored)
      ? stored.map(normalizeId)
      : shopCategoryOptions
          .map((c) => c.id)
          .filter((slug) => (stored as Record<string, boolean>)[slug] !== false)

    const config = defaultConfig()
    for (const slug of slugs) {
      if (config[slug]) config[slug].visible = true
    }
    for (const slug of legacySelected.map(normalizeId)) {
      if (config[slug]) config[slug].visible = true
    }
    return config
  }

  return defaultConfig()
}

export function getShopCategoryConfig(): ShopCategoryConfig {
  if (!configCache) {
    configCache = getConfigLocal()
  }
  return configCache
}

export function getSelectedCategorySlugs(): string[] {
  const config = getShopCategoryConfig()
  return shopCategoryOptions
    .map((c) => c.id)
    .filter((slug) => config[slug]?.visible)
}

export function getVisibleShopCategories(): ShopCategory[] {
  const config = getShopCategoryConfig()
  return shopCategoryOptions
    .filter((cat) => config[cat.id]?.visible && config[cat.id]?.image)
    .map((cat) => ({ ...cat, image: config[cat.id]?.image || cat.image }))
}

export function countShopCategoryProducts(
  category: ShopCategory,
  products: ProductDetail[],
): number {
  return products.filter(category.matchProduct).length
}

export async function hydrateShopCategoryStore(): Promise<void> {
  if (!isSupabaseConfigured()) {
    configCache = getConfigLocal()
    notifyChanged()
    return
  }

  try {
    const { data, error } = await getSupabase()
      .from('shop_category_visibility')
      .select('category_id, visible, image_url')

    if (error) throw error

    const remote: ShopCategoryConfig = {}
    for (const row of data ?? []) {
      const slug = normalizeId(row.category_id)
      remote[slug] = {
        visible: row.visible,
        image: row.image_url ?? undefined,
      }
    }
    configCache = mergeConfig(remote, getConfigLocal())
    saveStore(CONFIG_KEY, configCache)
  } catch {
    configCache = getConfigLocal()
  }
  notifyChanged()
}

async function persistConfigToSupabase(config: ShopCategoryConfig): Promise<void> {
  if (!isSupabaseConfigured()) return

  const sync = await syncSupabaseAdminSession()
  if (!sync.ok) return

  const client = getSupabaseAdmin()
  await Promise.all(
    shopCategoryOptions.map((cat) => {
      const item = config[cat.id] ?? emptyConfigItem()
      return client.from('shop_category_visibility').upsert({
        category_id: cat.id,
        visible: item.visible,
        image_url: item.image ?? null,
        updated_at: new Date().toISOString(),
      })
    }),
  )
}

export async function saveShopCategoryConfig(config: ShopCategoryConfig): Promise<void> {
  const next = mergeConfig(config, {})
  configCache = next
  saveStore(CONFIG_KEY, next)
  saveStore(SELECTED_KEY, getSelectedCategorySlugs())
  notifyChanged()
  await persistConfigToSupabase(next)
}

export async function saveShopCategorySelection(slugs: string[]): Promise<void> {
  const config = getShopCategoryConfig()
  const selected = new Set(slugs.map(normalizeId))
  const next: ShopCategoryConfig = {}
  for (const cat of shopCategoryOptions) {
    next[cat.id] = {
      visible: selected.has(cat.id),
      image: config[cat.id]?.image,
    }
  }
  await saveShopCategoryConfig(next)
}

export async function updateShopCategoryItem(
  slug: string,
  updates: Partial<ShopCategoryConfigItem>,
): Promise<void> {
  const config = getShopCategoryConfig()
  const current = config[slug] ?? emptyConfigItem()
  await saveShopCategoryConfig({
    ...config,
    [slug]: { ...current, ...updates },
  })
}

export async function applyShopCategorySelectionFromProduct(
  image: string,
  selectedIds: string[],
): Promise<void> {
  const selected = new Set(selectedIds)
  const current = getShopCategoryConfig()
  const next: ShopCategoryConfig = { ...current }

  for (const cat of shopCategoryOptions) {
    const prev = current[cat.id] ?? emptyConfigItem()
    if (selected.has(cat.id)) {
      next[cat.id] = { visible: true, image }
      continue
    }
    // If this product was previously driving the category image, unchecking removes it.
    if (prev.image === image) {
      next[cat.id] = { visible: false, image: undefined }
    } else {
      next[cat.id] = prev
    }
  }

  await saveShopCategoryConfig(next)
}
