import { useEffect, useState } from 'react'
import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { BarChart3, LayoutDashboard, LogOut, Mail, Package, RotateCcw, Shirt, Store } from 'lucide-react'
import { isSupabaseConfigured } from '../../config/env'
import { adminLogout, verifyAdminSession } from '../../services/adminService'
import { getUnreadContactCount, loadContactMessages } from '../../services/contactService'
import { getOrders, loadOrders } from '../../services/orderService'
import { getReturns, loadReturns } from '../../services/returnService'
import { getPageVisits, loadPageVisits } from '../../services/analyticsService'
import { getAllProductDetails } from '../../data/productCatalog'
import { hydrateProductStore } from '../../services/productService'

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
  const orderCount = getOrders().length
  const productCount = getAllProductDetails().length
  const returnCount = getReturns().length
  const visitCount = getPageVisits().length

  const handleLogout = async () => {
    await adminLogout()
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex min-h-screen bg-cream-dark">
      <aside className="flex w-60 shrink-0 flex-col border-r border-accent bg-cream">
        <div className="border-b border-accent px-5 py-6">
          <div className="flex items-center gap-2">
            <Store size={20} className="text-maroon" />
            <span className="font-serif text-sm font-medium text-charcoal">BF Admin</span>
          </div>
          <p className="mt-1 text-[10px] tracking-wide text-charcoal/40 uppercase">Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setTick((t) => t + 1)}
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
        <Outlet />
      </main>
    </div>
  )
}
