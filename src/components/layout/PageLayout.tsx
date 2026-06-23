import { Outlet } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import SearchDrawer from '../search/SearchDrawer'
import CartDrawer from '../cart/CartDrawer'

export default function PageLayout() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Outlet />
      <Footer />
      <SearchDrawer />
      <CartDrawer />
    </>
  )
}
