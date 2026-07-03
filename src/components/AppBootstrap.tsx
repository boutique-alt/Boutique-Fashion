import { useEffect, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { hydrateProductStore } from '../services/productService'
import { hydrateShopCategoryStore } from '../services/shopCategoryService'

export default function AppBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    void Promise.all([hydrateProductStore(), hydrateShopCategoryStore()])
  }, [])

  return children
}
