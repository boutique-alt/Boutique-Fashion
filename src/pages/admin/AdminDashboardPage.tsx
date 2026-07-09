import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Package, Users } from 'lucide-react'
import { isSupabaseConfigured } from '../../config/env'
import { getAdminStats, type AdminStats } from '../../services/adminStatsService'

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<AdminStats | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getAdminStats()
      .then(setStatsData)
      .finally(() => setReady(true))
  }, [])

  if (!ready || !statsData) return null

  const { totalOrders, paidOrders, revenue, totalMessages, unreadMessages, totalCustomers } = statsData

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Package, href: '/admin/orders' },
    { label: 'Paid Orders', value: paidOrders, icon: Package, href: '/admin/orders' },
    { label: 'Messages', value: totalMessages, icon: Mail, href: '/admin/messages', badge: unreadMessages },
    { label: 'Customers', value: totalCustomers, icon: Users, href: '/admin/orders' },
  ]

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Overview of your store activity</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, badge }) => (
          <Link
            key={label}
            to={href}
            className="border border-accent bg-cream p-5 transition-colors hover:border-maroon/30"
          >
            <div className="flex items-center justify-between">
              <Icon size={20} className="text-maroon" strokeWidth={1.5} />
              {badge !== undefined && badge > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] text-cream">{badge} new</span>
              )}
            </div>
            <p className="mt-4 font-serif text-2xl text-charcoal">{value}</p>
            <p className="mt-1 text-xs tracking-wide text-charcoal/50 uppercase">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-accent bg-cream p-6">
          <h2 className="font-serif text-lg text-charcoal">Revenue (Paid)</h2>
          <p className="mt-2 font-serif text-3xl text-maroon">₹{revenue.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-charcoal/50">From completed payments</p>
        </div>
        <div className="border border-accent bg-cream p-6">
          <h2 className="font-serif text-lg text-charcoal">Integration Status</h2>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
            <li className="flex justify-between">
              <span>Supabase</span>
              <span className={isSupabaseConfigured() ? 'text-maroon' : 'text-gold'}>
                {isSupabaseConfigured() ? 'Connected' : 'Not configured'}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Razorpay Backend</span>
              <span className="text-gold">Pending</span>
            </li>
            <li className="flex justify-between">
              <span>Data Storage</span>
              <span className="text-maroon">
                Supabase
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
