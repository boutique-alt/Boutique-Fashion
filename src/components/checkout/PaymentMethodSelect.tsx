import { CreditCard, Wallet } from 'lucide-react'
import { isRazorpayConfigured } from '../../config/env'
import type { PaymentMethod } from '../../types/order'

interface PaymentMethodSelectProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const methods: { id: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    description: 'UPI, Cards, Net Banking, Wallets',
    icon: CreditCard,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Wallet,
  },
]

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-xl text-charcoal">Payment Method</h2>
      {!isRazorpayConfigured() && (
        <p className="text-xs text-charcoal/50">
          Razorpay key not configured — payments will run in demo mode until backend is connected.
        </p>
      )}
      <div className="space-y-3">
        {methods.map(({ id, label, description, icon: Icon }) => (
          <label
            key={id}
            className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${
              value === id ? 'border-maroon bg-maroon/5' : 'border-accent hover:border-maroon/40'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="mt-1 accent-maroon"
            />
            <Icon size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-charcoal">{label}</p>
              <p className="mt-0.5 text-xs text-charcoal/60">{description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
