import { useEffect, useState } from 'react'
import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { BarChart3, LayoutDashboard, LogOut, Mail, Package, RotateCcw, Shirt, Store, Menu, X } from 'lucide-react'
import { isSupabaseConfigured } from '../../config/env'
import { adminLogout, getLastAdminSyncError, verifyAdminSession } from '../../services/adminService'
import { getUnreadContactCount, loadContactMessages } from '../../services/contactService'
import { getOrders, loadOrders } from '../../services/orderService'
import { getReturns, loadReturns } from '../../services/returnService'
import { getPageVisits, loadPageVisits } from '../../services/analyticsService'
import { getAllProductDetails } from '../../data/productCatalog'
import { hydrateProductStore } from '../../services/productService'
import { hydrateShopCategoryStore } from '../../services/shopCategoryService'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Shirt, end: false },
  { to: '/admin/orders', label: 'Orders', icon: Package, end: false },
  { to: '/admin/messages', label: 'Messages', icon: Mail, end: false },
  { to: '/admin/returns', label: 'Returns', icon: RotateCcw, end: false },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, end: false },
]

export default function AdminLayout() {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    verifyAdminSession().then(async (ok) => {
      if (ok && isSupabaseConfigured()) {
        await Promise.all([
          loadOrders(),
          loadReturns(),
          loadContactMessages(),
          loadPageVisits(),
          hydrateProductStore(),
          hydrateShopCategoryStore(),
        ])
        setTick((t) => t + 1)
      }
      setAuthed(ok)
      setChecked(true)
    })
  }, [])

  if (!checked) return null

  if (!authed) {
    return <Navigate to="/admin/login" replace />
  }

  const unreadCount = getUnreadContactCount()
  const syncError = getLastAdminSyncError()
  const orderCount = getOrders().length
  const productCount = getAllProductDetails().length
  const returnCount = getReturns().length
  const visitCount = getPageVisits().length

  const handleLogout = async () => {
    await adminLogout()
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-dark md:flex-row">
      {/* Mobile Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-accent bg-cream px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Store size={20} className="text-maroon" />
          <span className="font-serif text-sm font-medium text-charcoal">BF Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-charcoal p-1 rounded hover:bg-cream-dark"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-accent bg-cream transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-accent px-5 py-6">
          <div>
            <div className="flex items-center gap-2">
              <Store size={20} className="text-maroon" />
              <span className="font-serif text-sm font-medium text-charcoal">BF Admin</span>
            </div>
            <p className="mt-1 text-[10px] tracking-wide text-charcoal/40 uppercase">Dashboard</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-charcoal/60 hover:text-maroon"
            aria-label="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => { setTick((t) => t + 1); setIsMobileMenuOpen(false) }}
              className={({ isActive }) =>
                `flex items-center justify-between rounded px-3 py-2.5 text-xs font-medium tracking-[0.08em] uppercase transition-colors ${
                  isActive
                    ? 'bg-maroon text-cream'
                    : 'text-charcoal/70 hover:bg-cream-dark hover:text-charcoal'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </span>
              {label === 'Messages' && unreadCount > 0 && (
                <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] text-cream">
                  {unreadCount}
                </span>
              )}
              {label === 'Orders' && orderCount > 0 && (
                <span className="text-[10px] opacity-70">{orderCount}</span>
              )}
              {label === 'Products' && productCount > 0 && (
                <span className="text-[10px] opacity-70">{productCount}</span>
              )}
              {label === 'Returns' && returnCount > 0 && (
                <span className="text-[10px] opacity-70">{returnCount}</span>
              )}
              {label === 'Analytics' && visitCount > 0 && (
                <span className="text-[10px] opacity-70">{visitCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-accent p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-[0.08em] text-gold uppercase transition-colors hover:text-gold-light"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {syncError && (
          <div className="border-b border-gold/40 bg-gold/10 px-6 py-3 text-sm text-charcoal">
            <strong>Cloud sync issue:</strong> {syncError}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
