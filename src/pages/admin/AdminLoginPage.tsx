import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { adminLogin, isAdminLoggedIn } from '../../services/adminService'
import { env } from '../../config/env'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(env.adminEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await adminLogin(email, password)
    setLoading(false)

    if (result.ok) {
      window.location.href = '/admin'
      return
    }
    setError(result.error ?? 'Invalid credentials')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-dark px-4">
      <div className="w-full max-w-sm border border-accent bg-cream p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10">
            <Lock size={22} className="text-maroon" />
          </div>
          <h1 className="font-serif text-xl text-charcoal">Admin Login</h1>
          <p className="mt-1 text-xs text-charcoal/50">Boutique Fashion Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
              placeholder="admin@boutiquefashion.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-gold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-charcoal/40">
          Or sign in at{' '}
          <button
            type="button"
            onClick={() => navigate('/account')}
            className="text-maroon hover:underline"
          >
            My Account
          </button>
          {' '}with the same admin credentials
        </p>
      </div>
    </div>
  )
}
