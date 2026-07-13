import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import SearchDrawer from '../search/SearchDrawer'
import CartDrawer from '../cart/CartDrawer'
import PageVisitTracker from '../analytics/PageVisitTracker'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function PageLayout() {
  const { pathname } = useLocation()
  const fixedHeaderRef = useRef<HTMLDivElement>(null)
  const [headerOffset, setHeaderOffset] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const node = fixedHeaderRef.current
    if (!node) return

    const update = () => setHeaderOffset(node.getBoundingClientRect().height)

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <PageVisitTracker />
      <div ref={fixedHeaderRef} className="fixed inset-x-0 top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <div style={{ paddingTop: headerOffset }}>
        <Outlet />
      </div>
      <Footer />
      <SearchDrawer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  )
}
