import { LEGACY_SHOP_CATEGORY_IDS, shopCategoryOptions } from '../data/shopCategories'
import { getAllProductDetails } from '../data/productCatalog'
import type { ShopCategory } from '../types/shopCategory'
import type { ProductDetail } from '../data/productCatalog'
import { subscribeProductCatalog } from './productService'

const listeners = new Set<() => void>()

function notifyChanged(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeShopCategories(listener: () => void): () => void {
  listeners.add(listener)
  const unsubCatalog = subscribeProductCatalog(listener)
  return () => {
    listeners.delete(listener)
    unsubCatalog()
  }
}

function normalizeId(id: string): string {
  return LEGACY_SHOP_CATEGORY_IDS[id] ?? id
}

export function getVisibleShopCategories(): ShopCategory[] {
  const products = getAllProductDetails()

  return shopCategoryOptions
    .map((cat) => {
      const owner = products.find((product) =>
        product.shopCategorySelections?.some((id) => normalizeId(id) === cat.id),
      )
      if (!owner?.image) return null
      return { ...cat, image: owner.image }
    })
    .filter((cat): cat is ShopCategory => cat !== null)
}

export function countShopCategoryProducts(
  category: ShopCategory,
  products: ProductDetail[],
): number {
  return products.filter(category.matchProduct).length
}

export async function hydrateShopCategoryStore(): Promise<void> {
  notifyChanged()
}

export function getShopCategoryConfig(): Record<string, { visible: boolean; image?: string }> {
  const visible = getVisibleShopCategories()
  const config: Record<string, { visible: boolean; image?: string }> = {}
  for (const cat of shopCategoryOptions) {
    const match = visible.find((item) => item.id === cat.id)
    config[cat.id] = {
      visible: Boolean(match),
      image: match?.image,
    }
  }
  return config
}

export function getSelectedCategorySlugs(): string[] {
  return getVisibleShopCategories().map((cat) => cat.id)
}

export async function applyShopCategorySelectionFromProduct(
  image: string,
  selectedIds: string[],
): Promise<void> {
  void image
  void selectedIds
  notifyChanged()
}
