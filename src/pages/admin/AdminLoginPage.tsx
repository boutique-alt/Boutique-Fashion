import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { adminLogin, isAdminLoggedIn } from '../../services/adminService'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminLogin(password)) {
      window.location.href = '/admin'
      return
    }
    setError('Invalid password')
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-sm text-gold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-maroon py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-charcoal/40">
          Default: admin123 — change via VITE_ADMIN_PASSWORD
        </p>
      </div>
    </div>
  )
}
