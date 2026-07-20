import { allCategories, type CategoryConfig } from './categories'
import type { ProductDetail } from './productCatalog'
import { blouseCategoryImage } from './blouseProducts'
import { dressCategoryImage } from './dressProducts'
import { kurtaCoordCategoryImage } from './kurtaCoordProducts'
import { mensCategoryImage } from './mensProducts'
import type { ShopCategory } from '../types/shopCategory'

const fallbackImages: Record<string, string> = {
  'one-piece': dressCategoryImage,
  'kurta-set': kurtaCoordCategoryImage,
  'coord-set': kurtaCoordCategoryImage,
  blouse: blouseCategoryImage,
  mens: mensCategoryImage,
  bridal: blouseCategoryImage,
  groom: '/images/mens/04.webp',
}

export function getCategoryHref(cat: CategoryConfig): string {
  return cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`
}

export function getDefaultCategoryImage(cat: CategoryConfig): string {
  return cat.products[0]?.image ?? fallbackImages[cat.slug] ?? dressCategoryImage
}

function inSlugs(...slugs: string[]) {
  return (product: ProductDetail) => slugs.includes(product.categorySlug)
}

export function buildShopCategory(
  cat: CategoryConfig,
  customImage?: string,
  label?: string,
  href?: string,
  sourceSlugs?: string[],
): ShopCategory {
  const slugs = sourceSlugs?.length ? sourceSlugs : [cat.slug]
  return {
    id: cat.slug,
    label: label ?? cat.title,
    href: href ?? getCategoryHref(cat),
    image: customImage || getDefaultCategoryImage(cat),
    sourceSlugs: slugs,
    matchProduct: inSlugs(...slugs),
  }
}

const onePiece = allCategories.find((cat) => cat.slug === 'one-piece')
const kurta = allCategories.find((cat) => cat.slug === 'kurta-set')
const blouse = allCategories.find((cat) => cat.slug === 'blouse')
const mens = allCategories.find((cat) => cat.slug === 'mens')

export const shopCategoryOptions: ShopCategory[] = [
  onePiece && buildShopCategory(onePiece, undefined, 'Jamdani Edit', '/dress/one-piece', ['one-piece']),
  kurta && buildShopCategory(kurta, undefined, 'Ajrakh & Daboo Handblock', '/dress/kurta-set', ['kurta-set', 'coord-set']),
  blouse && buildShopCategory(blouse, undefined, 'Bridal Edit', '/bridal/women', ['blouse']),
  mens && buildShopCategory(mens, undefined, 'Mashru, Modal', '/bridal/groom', ['mens']),
].filter(Boolean) as ShopCategory[]

export const shopCategoryCheckboxOptions = shopCategoryOptions

export function getShopCategoryById(id: string): ShopCategory | undefined {
  return shopCategoryOptions.find((c) => c.id === id)
}

export function defaultSelectedCategorySlugs(): string[] {
  return shopCategoryOptions.map((cat) => cat.id)
}

export const LEGACY_SHOP_CATEGORY_IDS: Record<string, string> = {
  'jamdani-edit': 'one-piece',
  'ajrakh-daboo-handbook': 'kurta-set',
  'bridal-edit': 'blouse',
  'silk-mashura': 'mens',
  'silk-modal': 'mens',
}
