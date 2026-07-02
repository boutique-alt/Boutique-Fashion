import { useEffect, useState } from 'react'
import {
  getVisibleShopCategories,
  subscribeShopCategories,
} from '../services/shopCategoryService'

export function useShopCategories() {
  const [tick, setTick] = useState(0)

  useEffect(() => subscribeShopCategories(() => setTick((t) => t + 1)), [])

  return { categories: getVisibleShopCategories(), tick }
}
