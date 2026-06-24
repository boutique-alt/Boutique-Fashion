import { useEffect, useState, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { loadContactMessages } from '../services/contactService'
import { loadOrders } from '../services/orderService'
import { loadPageVisits } from '../services/analyticsService'
import { hydrateProductStore } from '../services/productService'
import { loadReturns } from '../services/returnService'

export default function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    Promise.all([
      hydrateProductStore(),
      loadOrders(),
      loadReturns(),
      loadContactMessages(),
      loadPageVisits(),
    ]).finally(() => setReady(true))
  }, [])

  if (!ready) return null
  return children
}
