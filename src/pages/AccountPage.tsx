import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import AccountSidebar from '../components/account/AccountSidebar'
import ProfileForm from '../components/account/ProfileForm'
import { useStore } from '../context/StoreContext'
import { aboutAssets } from '../data/about'
import { getOrdersByEmail } from '../services/orderService'
import { getOrCreateProfile, updateProfile } from '../services/profileService'
import type { UserProfile } from '../types/user'
import type { Order } from '../types/order'

export default function AccountPage() {
  const { user, login, logout, register } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile(getOrCreateProfile(user))
    }
  }, [user])

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setMessage('Please fill in all required fields.')
      return
    }
    if (mode === 'register' && !name) {
      setMessage('Please enter your name.')
      return
    }
    if (mode === 'login') {
      login({ name: name || email.split('@')[0], email })
    } else {
      register({ name, email })
    }
    setMessage('')
    setPassword('')
  }

  const handleProfileSave = (updates: Partial<UserProfile>) => {
    if (!user) return
    const updated = updateProfile(user.email, updates)
    setProfile(updated)
    if (updates.name) login({ name: updates.name, email: user.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (user && profile) {
    return (
      <main>
        <PageBanner
          title="My Account"
          image={aboutAssets.banner}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'My Account' },
          ]}
        />
        <section className="py-12 md:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 md:px-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <AccountSidebar
                name={profile.name}
                email={profile.email}
                avatarUrl={profile.avatarUrl}
                onLogout={logout}
              />
            </div>
            <div className="border border-accent p-6 lg:col-span-2 md:p-8">
              <ProfileForm profile={profile} onSave={handleProfileSave} saved={saved} />
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <PageBanner
        title={mode === 'login' ? 'Sign In' : 'Create Account'}
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Account' },
        ]}
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-md px-4 md:px-6">
          <div className="mb-6 flex border-b border-accent">
            <button
              onClick={() => { setMode('login'); setMessage('') }}
              className={`flex-1 pb-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === 'login' ? 'border-b-2 border-maroon text-maroon' : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('register'); setMessage('') }}
              className={`flex-1 pb-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === 'register' ? 'border-b-2 border-maroon text-maroon' : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon"
              />
            </div>
            {message && <p className="text-sm text-gold">{message}</p>}
            <button
              type="submit"
              className="w-full bg-maroon py-3.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
            >
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-charcoal/50">
              <button type="button" className="transition-colors hover:text-maroon">Lost password?</button>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export function AccountOrdersPage() {
  const { user, logout } = useStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      setProfile(getOrCreateProfile(user))
      setOrders(getOrdersByEmail(user.email))
    }
  }, [user])

  if (!user) {
    return <Navigate to="/account" replace />
  }

  if (!profile) {
    return null
  }

  return (
    <main>
      <PageBanner
        title="My Orders"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Account', href: '/account' },
          { label: 'My Orders' },
        ]}
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:px-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AccountSidebar
              name={profile.name}
              email={profile.email}
              avatarUrl={profile.avatarUrl}
              onLogout={logout}
            />
          </div>
          <div className="border border-accent p-6 lg:col-span-2 md:p-8">
            <h2 className="mb-6 font-serif text-xl text-charcoal">Order History</h2>
            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <Package size={40} className="mx-auto text-charcoal/20" />
                <p className="mt-4 text-sm text-charcoal/50">No orders yet.</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-accent p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-charcoal/50">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      <span className="text-xs font-medium tracking-wide text-maroon uppercase">
                        {order.status}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-charcoal/70">
                      {order.items.map((item) => (
                        <li key={item.key}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 font-medium text-charcoal">
                      ₹{order.total.toLocaleString('en-IN')} · {order.paymentMethod}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
