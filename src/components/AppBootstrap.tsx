import { useEffect, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { hydrateProductStore } from '../services/productService'
import { hydrateShopCategoryStore } from '../services/shopCategoryService'

const catalogChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('bf-catalog')
  : null

export default function AppBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    void Promise.all([
      hydrateProductStore(),
      hydrateShopCategoryStore(),
    ])

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void hydrateProductStore()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    const onCatalogMessage = () => {
      void hydrateProductStore()
    }
    catalogChannel?.addEventListener('message', onCatalogMessage)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      catalogChannel?.removeEventListener('message', onCatalogMessage)
    }
  }, [])

  return children
}
