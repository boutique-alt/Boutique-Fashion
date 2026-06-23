import { Link } from 'react-router-dom'
import { Mail, Package, Users } from 'lucide-react'
import { getContactMessages, getUnreadContactCount } from '../../services/contactService'
import { getOrders } from '../../services/orderService'
import { getAllProfiles } from '../../services/profileService'

export default function AdminDashboardPage() {
  const orders = getOrders()
  const messages = getContactMessages()
  const profiles = getAllProfiles()
  const unread = getUnreadContactCount()
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid').length
  const revenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, href: '/admin/orders' },
    { label: 'Paid Orders', value: paidOrders, icon: Package, href: '/admin/orders' },
    { label: 'Messages', value: messages.length, icon: Mail, href: '/admin/messages', badge: unread },
    { label: 'Customers', value: profiles.length, icon: Users, href: '/admin/orders' },
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
              <span className="text-gold">Pending</span>
            </li>
            <li className="flex justify-between">
              <span>Razorpay Backend</span>
              <span className="text-gold">Pending</span>
            </li>
            <li className="flex justify-between">
              <span>Data Storage</span>
              <span className="text-maroon">localStorage (demo)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
