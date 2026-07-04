import { useEffect, useState } from 'react'
import type { UserProfile, UserGender } from '../../types/user'
import ProfileAvatar from './ProfileAvatar'

interface ProfileFormProps {
  profile: UserProfile
  onSave: (updates: Partial<UserProfile>) => void
  saved: boolean
}

const inputClass =
  'w-full border border-accent px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon'

export default function ProfileForm({ profile, onSave, saved }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone ?? '',
    gender: (profile.gender ?? '') as UserGender,
    voluntaryConsent: profile.voluntaryConsent ?? false,
    line1: profile.address?.line1 ?? '',
    line2: profile.address?.line2 ?? '',
    city: profile.address?.city ?? '',
    state: profile.address?.state ?? '',
    pincode: profile.address?.pincode ?? '',
    avatarUrl: profile.avatarUrl,
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: profile.name,
      phone: profile.phone ?? '',
      gender: (profile.gender ?? '') as UserGender,
      voluntaryConsent: profile.voluntaryConsent ?? false,
      line1: profile.address?.line1 ?? '',
      line2: profile.address?.line2 ?? '',
      city: profile.address?.city ?? '',
      state: profile.address?.state ?? '',
      pincode: profile.address?.pincode ?? '',
      avatarUrl: profile.avatarUrl,
    })
  }, [profile])

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: form.name,
      phone: form.phone,
      gender: form.gender || undefined,
      voluntaryConsent: form.voluntaryConsent,
      avatarUrl: form.avatarUrl,
      address: form.line1
        ? {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          }
        : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProfileAvatar
        name={form.name}
        avatarUrl={form.avatarUrl}
        onChange={(url) => handleChange('avatarUrl', url)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
            Full Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
            Email
          </label>
          <input value={profile.email} disabled className={`${inputClass} bg-cream-dark text-charcoal/50`} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
            Gender
          </label>
          <select
            value={form.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className={inputClass}
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-serif text-lg text-charcoal">Shipping Address</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              Address Line 1
            </label>
            <input
              value={form.line1}
              onChange={(e) => handleChange('line1', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              Address Line 2
            </label>
            <input
              value={form.line2}
              onChange={(e) => handleChange('line2', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              City
            </label>
            <input
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              State
            </label>
            <input
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
              PIN Code
            </label>
            <input
              value={form.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={form.voluntaryConsent}
          onChange={(e) => handleChange('voluntaryConsent', e.target.checked)}
          className="mt-1 accent-maroon"
          required
        />
        <span className="text-sm leading-relaxed text-charcoal/70">
          I confirm that all information provided here is given willingly and of my own accord.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!form.voluntaryConsent}
          className="bg-maroon px-10 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Profile
        </button>
        {saved && <span className="text-sm text-maroon">Profile saved!</span>}
      </div>
    </form>
  )
}
