import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import AdminLayout from './components/admin/AdminLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import DressPage from './pages/DressPage'
import CategoryPage from './pages/CategoryPage'
import ShopPage from './pages/ShopPage'
import ShopAllPage from './pages/ShopAllPage'
import ContactPage from './pages/ContactPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import AccountPage, { AccountOrdersPage } from './pages/AccountPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="dress" element={<DressPage />} />
          <Route path="dress/:category" element={<CategoryPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/all" element={<ShopAllPage />} />
          <Route path="shop/all/page/:page" element={<ShopAllPage />} />
          <Route path="mens" element={<CategoryPage slug="mens" />} />
          <Route path="blouse" element={<CategoryPage slug="blouse" />} />
          <Route path="three-piece" element={<CategoryPage slug="three-piece" />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account/orders" element={<AccountOrdersPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
