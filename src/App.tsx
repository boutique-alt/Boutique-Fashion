import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PageLayout from './components/layout/PageLayout'
import AdminLayout from './components/admin/AdminLayout'
import ScrollToTop from './components/layout/ScrollToTop'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const DressPage = lazy(() => import('./pages/DressPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ShopAllPage = lazy(() => import('./pages/ShopAllPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FabricPage = lazy(() => import('./pages/FabricPage'))
const BridalPage = lazy(() => import('./pages/BridalPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const AccountOrdersPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountOrdersPage })))
const AccountReturnsPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountReturnsPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const LegalDocumentPage = lazy(() => import('./pages/LegalDocumentPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminProductPreviewPage = lazy(() => import('./pages/admin/AdminProductPreviewPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'))
const AdminReturnsPage = lazy(() => import('./pages/admin/AdminReturnsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon/20 border-t-maroon" />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about-us" element={<AboutPage />} />
            <Route path="contact-us" element={<ContactPage />} />
            <Route path="terms-and-conditions" element={<LegalDocumentPage variant="terms" />} />
            <Route path="privacy-policy" element={<LegalDocumentPage variant="privacy" />} />
            <Route path="fabric" element={<FabricPage />} />
            <Route path="bridal" element={<BridalPage />} />
            <Route path="bridal/women" element={<CategoryPage slug="blouse" />} />
            <Route path="bridal/groom" element={<CategoryPage slug="mens" />} />
            <Route path="dress" element={<DressPage />} />
            <Route path="dress/:category" element={<CategoryPage />} />
            <Route path="shop" element={<Navigate to="/dress" replace />} />
            <Route path="shop/all" element={<ShopAllPage />} />
            <Route path="shop/all/page/:page" element={<ShopAllPage />} />
            <Route path="mens" element={<CategoryPage slug="mens" />} />
            <Route path="blouse" element={<CategoryPage slug="blouse" />} />
            <Route path="three-piece" element={<CategoryPage slug="three-piece" />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="account/reset-password" element={<ResetPasswordPage />} />
            <Route path="account/orders" element={<AccountOrdersPage />} />
            <Route path="account/returns" element={<AccountReturnsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/preview/:slug" element={<AdminProductPreviewPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="returns" element={<AdminReturnsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </HelmetProvider>
  )
}
