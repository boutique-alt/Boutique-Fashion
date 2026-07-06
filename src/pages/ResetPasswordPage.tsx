import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/ui/PasswordInput'
import { isSupabaseConfigured } from '../config/env'
import { getSupabase } from '../lib/supabase'
import { updateCustomerPassword } from '../services/authService'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const client = getSupabase()
    if (window.location.hash.includes('type=recovery')) {
      setReady(true)
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setMessage('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const result = await updateCustomerPassword(password)
      if (!result.ok) {
        setMessage(result.error ?? 'Could not update password.')
        return
      }
      navigate('/account', { replace: true })
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <main>
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-md px-4 text-center md:px-6">
            <p className="text-sm text-charcoal/60">Supabase is not configured.</p>
          </div>
        </section>
      </main>
    )
  }

  if (!ready) {
    return (
      <main>
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-md px-4 text-center md:px-6">
            <p className="text-sm text-charcoal/60">
              This reset link is invalid or has expired.
            </p>
            <Link to="/account" className="mt-4 inline-block text-sm text-maroon hover:underline">
              Back to login
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-md px-4 md:px-6">
          <h1 className="mb-6 text-center font-serif text-2xl text-charcoal">Set New Password</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                New Password *
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
            </div>
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
            {message && <p className="text-sm text-gold">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon py-3.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Update Password'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
