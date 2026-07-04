import { useEffect, useState, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { hydrateProductStore } from '../services/productService'
import { hydrateShopCategoryStore } from '../services/shopCategoryService'

const catalogChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('bf-catalog')
  : null

export default function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    Promise.all([
      hydrateProductStore(),
      hydrateShopCategoryStore(),
    ]).finally(() => setReady(true))

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

  if (!ready) return <div className="flex min-h-screen items-center justify-center"><p className="text-sm text-charcoal/40 animate-pulse">Loading...</p></div>
  return children
}
