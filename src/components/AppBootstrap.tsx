import { useEffect, useState, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { hydrateProductStore } from '../services/productService'
import { hydrateShopCategoryStore } from '../services/shopCategoryService'

const catalogChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('bf-catalog')
  : null

async function loadCatalog() {
  let result = await hydrateProductStore()
  if (!result.ok && isSupabaseConfigured()) {
    result = await hydrateProductStore()
  }
  await hydrateShopCategoryStore()
  return result
}

export default function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      void hydrateProductStore()
      return
    }

    void loadCatalog().finally(() => setReady(true))

    const onCatalogMessage = () => {
      void hydrateProductStore()
    }
    catalogChannel?.addEventListener('message', onCatalogMessage)

    return () => {
      catalogChannel?.removeEventListener('message', onCatalogMessage)
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon/20 border-t-maroon" />
      </div>
    )
  }

  return children
}
