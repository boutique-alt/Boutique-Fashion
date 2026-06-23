import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import PaymentMethodSelect from '../components/checkout/PaymentMethodSelect'
import { useStore } from '../context/StoreContext'
import { aboutAssets } from '../data/about'
import { brand } from '../data/navigation'
import { createOrder } from '../services/orderService'
import { initiateRazorpayPayment } from '../services/razorpay'
import type { PaymentMethod } from '../types/order'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const [placed, setPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  })

  if (cart.length === 0 && !placed) {
    return <Navigate to="/cart" replace />
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const placeOrder = (
    paymentStatus: 'paid' | 'pending',
    razorpayIds?: { paymentId?: string; orderId?: string },
  ) => {
    createOrder({
      items: [...cart],
      billing: form,
      subtotal: cartTotal,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId: razorpayIds?.paymentId,
      razorpayOrderId: razorpayIds?.orderId,
    })
    clearCart()
    setPlaced(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')
    setLoading(true)

    try {
      if (paymentMethod === 'cod') {
        placeOrder('pending')
        return
      }

      const result = await initiateRazorpayPayment({
        amount: cartTotal * 100,
        name: brand.name,
        description: `Order — ${cart.length} item(s)`,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
      })

      if (!result.success) {
        setPaymentError(result.error ?? 'Payment failed. Please try again.')
        return
      }

      placeOrder('paid', { paymentId: result.paymentId, orderId: result.orderId })
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <main>
        <section className="flex min-h-[60vh] items-center justify-center py-20">
          <div className="px-4 text-center">
            <CheckCircle size={56} className="mx-auto text-maroon" />
            <h1 className="mt-6 font-serif text-3xl text-charcoal">Order Placed!</h1>
            <p className="mt-3 max-w-md text-sm text-charcoal/60">
              Thank you for shopping with {brand.name}. We&apos;ll contact you shortly to confirm your order.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block bg-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <PageBanner
        title="Checkout"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-3">
            <div className="space-y-5">
              <h2 className="font-serif text-xl text-charcoal">Billing Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    First Name *
                  </label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    Last Name *
                  </label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Street Address *
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    City *
                  </label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    State *
                  </label>
                  <input
                    required
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    PIN Code *
                  </label>
                  <input
                    required
                    value={form.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Order Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full resize-none border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
            </div>

            <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />

            {paymentError && <p className="text-sm text-gold">{paymentError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon py-4 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60 sm:w-auto sm:px-12"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'razorpay'
                  ? 'Pay & Place Order'
                  : 'Place Order'}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="border border-accent p-6">
              <h2 className="mb-6 font-serif text-xl text-charcoal">Your Order</h2>
              <ul className="space-y-4 border-b border-accent pb-6">
                {cart.map((item) => (
                  <li key={item.key} className="flex justify-between gap-4 text-sm">
                    <span className="text-charcoal/70">
                      {item.name} × {item.quantity}
                      <span className="block text-xs text-charcoal/40">Size: {item.size}</span>
                    </span>
                    <span className="shrink-0 text-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span className="text-maroon">Free</span>
                </div>
                <div className="flex justify-between border-t border-accent pt-3 font-medium text-charcoal">
                  <span>Total</span>
                  <span className="font-serif text-lg">₹{cartTotal.toLocaleString('en-IN')}.00</span>
                </div>
              </div>
              <p className="mt-6 text-center text-[10px] tracking-wide text-charcoal/50 uppercase">
                Free shipping on all over India
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
