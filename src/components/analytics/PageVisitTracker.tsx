import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProductBySlug } from '../../data/productCatalog'
import { trackPageVisit } from '../../services/analyticsService'

export default function PageVisitTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    const match = pathname.match(/^\/product\/([^/]+)/)
    if (match) {
      const product = getProductBySlug(match[1])
      trackPageVisit(pathname, {
        productSlug: match[1],
        productName: product?.name,
      })
      return
    }
    trackPageVisit(pathname)
  }, [pathname])

  return null
}
