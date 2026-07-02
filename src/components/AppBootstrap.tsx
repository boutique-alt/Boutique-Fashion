import { useEffect, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { loadContactMessages } from '../services/contactService'
import { loadOrders } from '../services/orderService'
import { loadPageVisits } from '../services/analyticsService'
import { hydrateProductStore } from '../services/productService'
import { hydrateShopCategoryStore } from '../services/shopCategoryService'
import { loadReturns } from '../services/returnService'

const catalogChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('bf-catalog')
  : null

export default function AppBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    void Promise.all([
      hydrateProductStore(),
      hydrateShopCategoryStore(),
      loadOrders(),
      loadReturns(),
      loadContactMessages(),
      loadPageVisits(),
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
