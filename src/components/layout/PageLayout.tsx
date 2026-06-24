import { Outlet } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import SearchDrawer from '../search/SearchDrawer'
import CartDrawer from '../cart/CartDrawer'
import PageVisitTracker from '../analytics/PageVisitTracker'

export default function PageLayout() {
  return (
    <>
      <PageVisitTracker />
      <div className="fixed inset-x-0 top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
      <Footer />
      <SearchDrawer />
      <CartDrawer />
    </>
  )
}
