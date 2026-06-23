import type { Product } from './products'
import { allCategories } from './categories'

const PER_PAGE = 18

export function getAllShopProducts(): Product[] {
  const seen = new Set<string>()
  const products: Product[] = []
  for (const cat of allCategories) {
    for (const p of cat.products) {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        products.push(p)
      }
    }
  }
  return products
}

export const shopProducts = getAllShopProducts()
export const shopTotal = shopProducts.length
export const shopPerPage = PER_PAGE
export const shopTotalPages = Math.ceil(shopTotal / PER_PAGE)

export function getShopPageProducts(page: number): Product[] {
  const start = (page - 1) * PER_PAGE
  return shopProducts.slice(start, start + PER_PAGE)
}

export function getShopResultRange(page: number): { from: number; to: number; total: number } {
  const from = (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, shopTotal)
  return { from, to, total: shopTotal }
}
