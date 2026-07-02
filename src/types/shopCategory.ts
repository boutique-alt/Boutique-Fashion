import type { ProductDetail } from '../data/productCatalog'

export interface ShopCategory {
  id: string
  label: string
  href: string
  image: string
  sourceSlugs?: string[]
  matchProduct: (product: ProductDetail) => boolean
}

export interface ShopCategoryConfigItem {
  visible: boolean
  image?: string
}

export type ShopCategoryConfig = Record<string, ShopCategoryConfigItem>
