import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Package } from 'lucide-react'
import AccountSidebar from '../components/account/AccountSidebar'
import ProfileForm from '../components/account/ProfileForm'
import AccountRecentOrders from '../components/account/AccountRecentOrders'
import AccountOrderCard from '../components/account/AccountOrderCard'
import { useStore } from '../context/StoreContext'
import { fetchOrdersByEmail } from '../services/orderService'
import { fetchReturnsByEmail } from '../services/returnService'
import ReturnStatusBadge from '../components/return/ReturnStatusBadge'
import ReturnStatusStepper from '../components/return/ReturnStatusStepper'
import { getOrCreateProfile, updateProfile } from '../services/profileService'
import PasswordInput from '../components/ui/PasswordInput'
import RegisterConsentCheckboxes from '../components/account/RegisterConsentCheckboxes'
import { customerSignIn, customerSignUp, requestPasswordReset } from '../services/authService'
import { adminLogin } from '../services/adminService'
import { isSupabaseConfigured } from '../config/env'
import type { UserProfile, UserSession } from '../types/user'
import type { Order } from '../types/order'
import type { ReturnRequest } from '../types/return'

function AccountProfileLoading() {
  return (
    <main>
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon/20 border-t-maroon" />
      </div>
    </main>
  )
}

function fallbackProfile(session: UserSession): UserProfile {
  const now = new Date().toISOString()
  return {
    id: 'local',
    name: session.name,
    email: session.email,
    createdAt: now,
    updatedAt: now,
  }
}

export default function AccountPage() {
  const { user, login, logout } = useStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [saved, setSaved] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [authLoading, setAuthLoading] = useState(false)

  const loadOrders = async () => {
    if (!user) return
    setOrders(await fetchOrdersByEmail(user.email))
  }

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null)
      return
    }

    let cancelled = false
    getOrCreateProfile(user)
      .then((p) => {
        if (!cancelled) setProfile(p)
      })
      .catch(() => {
        if (!cancelled) setProfile(fallbackProfile(user))
      })
    loadOrders()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const onFocus = () => loadOrders()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (!user || !redirectTo?.startsWith('/')) return
    const path = redirectTo.split('?')[0]
    if (path === '/account') return
    navigate(redirectTo, { replace: true })
  }, [user, redirectTo, navigate])

  const finishAuth = (session: UserSession) => {
    login(session)
    setPassword('')
    setConfirmPassword('')
    setAcceptedTerms(false)
    setAcceptedPrivacy(false)
    setAuthLoading(false)
    setMessage('')
    if (redirectTo?.startsWith('/') && redirectTo.split('?')[0] !== '/account') {
      navigate(redirectTo, { replace: true })
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setMessage('Please fill in all required fields.')
      return
    }
    if (mode === 'register' && !name) {
      setMessage('Please enter your name.')
      return
    }
    if (mode === 'register' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    if (mode === 'register' && !acceptedTerms) {
      setMessage('Please accept the Terms & Conditions.')
      return
    }
    if (mode === 'register' && !acceptedPrivacy) {
      setMessage('Please accept the Privacy Policy.')
      return
    }

    if (isSupabaseConfigured()) {
      setAuthLoading(true)
      setMessage('')
      try {
        if (mode === 'login') {
          const adminResult = await adminLogin(email, password)
          if (adminResult.ok) {
            window.location.href = '/admin'
            return
          }

          const result = await customerSignIn(email, password)
          if (!result.ok) {
            setMessage(result.error ?? 'Login failed.')
            return
          }
          if (result.session) finishAuth(result.session)
        } else {
          const signUp = await customerSignUp(name, email, password)
          if (!signUp.ok) {
            setMessage(signUp.error ?? 'Registration failed.')
            return
          }

          const signIn = await customerSignIn(email, password)
          if (!signIn.ok || !signIn.session) {
            setMessage('Account created. Please check your email to confirm, then log in.')
            return
          }
          finishAuth(signIn.session)
        }
      } catch {
        setMessage('Something went wrong. Please try again.')
      } finally {
        setAuthLoading(false)
      }
      return
    }

    setMessage('Supabase is not configured. Please check your environment.')
    setAuthLoading(false)
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage('Please enter your email.')
      return
    }
    if (!isSupabaseConfigured()) {
      setMessage('Supabase is not configured. Please check your environment.')
      return
    }

    setAuthLoading(true)
    setMessage('')
    try {
      const result = await requestPasswordReset(email)
      if (!result.ok) {
        setMessage(result.error ?? 'Could not send reset email.')
        return
      }
      setMessage('Check your email for a password reset link.')
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleProfileSave = async (updates: Partial<UserProfile>) => {
    if (!user) return
    const updated = await updateProfile(user.email, updates)
    setProfile(updated)
    if (updates.name) login({ name: updates.name, email: user.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (user) {
    if (!profile) return <AccountProfileLoading />

    return (
      <main>
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
              <AccountRecentOrders orders={orders} email={user.email} />
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-md px-4 md:px-6">
          {mode !== 'forgot' && (
          <div className="mb-6 flex border-b border-accent">
            <button
              onClick={() => { setMode('login'); setMessage(''); setConfirmPassword(''); setAcceptedTerms(false); setAcceptedPrivacy(false) }}
              className={`flex-1 pb-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === 'login' ? 'border-b-2 border-maroon text-maroon' : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('register'); setMessage(''); setConfirmPassword(''); setAcceptedTerms(false); setAcceptedPrivacy(false) }}
              className={`flex-1 pb-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                mode === 'register' ? 'border-b-2 border-maroon text-maroon' : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Register
            </button>
          </div>
          )}

          {mode === 'forgot' && (
            <div className="mb-6 text-center">
              <h1 className="font-serif text-2xl text-charcoal">Reset Password</h1>
              <p className="mt-2 text-sm text-charcoal/60">
                Enter your email and we will send you a reset link.
              </p>
            </div>
          )}

          {redirectTo === '/checkout' && (
            <p className="mb-4 text-center text-sm text-charcoal/60">
              Log in or register to continue checkout. Your account email will be used for all orders.
            </p>
          )}

          <form onSubmit={mode === 'forgot' ? handleForgotSubmit : handleAuthSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label htmlFor="registerName" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Name *
                </label>
                <input
                  id="registerName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon"
                />
              </div>
            )}
            <div>
              <label htmlFor="authEmail" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                Email *
              </label>
              <input
                id="authEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon"
              />
            </div>
            {mode !== 'forgot' && (
            <div>
              <label htmlFor="authPassword" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                Password *
              </label>
              <PasswordInput
                id="authPassword"
                value={password}
                onChange={setPassword}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
            )}
            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Confirm Password *
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                />
              </div>
            )}
            {mode === 'register' && (
              <RegisterConsentCheckboxes
                termsAccepted={acceptedTerms}
                privacyAccepted={acceptedPrivacy}
                onTermsChange={setAcceptedTerms}
                onPrivacyChange={setAcceptedPrivacy}
              />
            )}
            {message && <p className="text-sm text-red-500">{message}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-maroon py-3.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60"
            >
              {authLoading ? 'Please wait...' : mode === 'login' ? 'Log In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
          {mode === 'login' && (
            <p className="mt-4 text-center text-xs text-charcoal/50">
              <button
                type="button"
                onClick={() => { setMode('forgot'); setMessage(''); setPassword('') }}
                className="transition-colors hover:text-maroon"
              >
                Lost password?
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p className="mt-4 text-center text-xs text-charcoal/50">
              <button
                type="button"
                onClick={() => { setMode('login'); setMessage('') }}
                className="transition-colors hover:text-maroon"
              >
                Back to login
              </button>
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

  const loadOrders = async () => {
    if (!user) return
    setOrders(await fetchOrdersByEmail(user.email))
  }

  useEffect(() => {
    if (!user) return
    getOrCreateProfile(user).then(setProfile).catch(() => setProfile(null))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const onFocus = () => loadOrders()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return <Navigate to="/account" replace />
  }

  if (!profile) {
    return null
  }

  return (
    <main>
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
                  to="/dress"
                  className="mt-4 inline-block text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <AccountOrderCard key={order.id} order={order} email={user.email} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export function AccountReturnsPage() {
  const { user, logout } = useStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const loadReturns = async () => {
    if (!user) return
    const [nextReturns, nextOrders] = await Promise.all([
      fetchReturnsByEmail(user.email),
      fetchOrdersByEmail(user.email),
    ])
    setReturns(nextReturns)
    setOrders(nextOrders)
  }

  useEffect(() => {
    if (!user) return
    getOrCreateProfile(user).then(setProfile).catch(() => setProfile(null))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReturns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const onFocus = () => loadReturns()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return <Navigate to="/account" replace />
  }

  if (!profile) {
    return null
  }

  return (
    <main>
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
            <h2 className="mb-2 font-serif text-xl text-charcoal">Return Requests</h2>
            <p className="mb-6 text-sm text-charcoal/50">
              Track your return status. Refunds are processed in 7–10 business days after pickup.
            </p>
            {returns.length === 0 ? (
              <div className="py-12 text-center">
                <Package size={40} className="mx-auto text-charcoal/20" />
                <p className="mt-4 text-sm text-charcoal/50">No return requests yet.</p>
                <Link
                  to="/account/orders"
                  className="mt-4 inline-block text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
                >
                  View My Orders
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {returns.map((ret) => {
                  const order = orders.find((o) => o.id === ret.orderId)
                  return (
                    <div key={ret.id} className="border border-accent p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-charcoal/50">
                          {new Date(ret.createdAt).toLocaleDateString('en-IN')}
                        </p>
                        <ReturnStatusBadge status={ret.status} />
                      </div>
                      {order && (
                        <ul className="mt-3 space-y-1 text-sm text-charcoal/70">
                          {order.items.map((item) => (
                            <li key={item.key}>{item.name} × {item.quantity}</li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-2 text-xs text-charcoal/60">Reason: {ret.reason}</p>
                      <div className="mt-4">
                        <ReturnStatusStepper status={ret.status} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <p className="mt-6 text-[10px] text-charcoal/40">
              <Link to="/contact-us" className="text-maroon hover:text-maroon-light">
                Read full return policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
