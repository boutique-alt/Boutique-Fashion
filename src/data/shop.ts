import type { Product } from './products'
import { getAllProductDetails } from './productCatalog'

const PER_PAGE = 18

export function getAllShopProducts(): Product[] {
  return getAllProductDetails()
}

export const shopPerPage = PER_PAGE

export function getShopTotal(): number {
  return getAllShopProducts().length
}

export function getShopTotalPages(): number {
  return Math.ceil(getShopTotal() / PER_PAGE)
}

export function getShopPageProducts(page: number): Product[] {
  const start = (page - 1) * PER_PAGE
  return getAllShopProducts().slice(start, start + PER_PAGE)
}

export function getShopResultRange(page: number): { from: number; to: number; total: number } {
  const total = getShopTotal()
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, total)
  return { from, to, total }
}
