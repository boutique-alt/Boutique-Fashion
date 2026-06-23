import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { submitContactMessage } from '../../services/contactService'
import type { ContactFormData } from '../../types/contact'

const inputClass =
  'w-full border border-accent bg-cream px-4 py-3 text-sm focus:border-maroon focus:outline-none'

const emptyForm: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(emptyForm)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      submitContactMessage(form)
      setSubmitted(true)
      setForm(emptyForm)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-accent bg-cream-dark/50 p-8 text-center">
        <CheckCircle size={40} className="mx-auto text-maroon" />
        <h3 className="mt-4 font-serif text-xl text-charcoal">Message Sent!</h3>
        <p className="mt-2 text-sm text-charcoal/60">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
            First Name *
          </label>
          <input
            required
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
            Last Name
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
          Email *
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
          Phone No.
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
          Comment or Message *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>
      {error && <p className="text-sm text-gold">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-maroon px-10 py-3.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
