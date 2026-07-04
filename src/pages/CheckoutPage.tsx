import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import PaymentMethodSelect from '../components/checkout/PaymentMethodSelect'
import UpiPaymentPanel from '../components/checkout/UpiPaymentPanel'
import { useStore } from '../context/StoreContext'
import { aboutAssets } from '../data/about'
import { brand } from '../data/navigation'
import { createOrder } from '../services/orderService'
import { getOrCreateProfile } from '../services/profileService'
import { initiateRazorpayPayment } from '../services/razorpay'
import type { PaymentMethod } from '../types/order'
import TrustBadges from '../components/trust/TrustBadges'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user, authReady } = useStore()
  const [placed, setPlaced] = useState(false)
  const [placedViaUpi, setPlacedViaUpi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [upiScreenshotUrl, setUpiScreenshotUrl] = useState<string | null>(null)
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

  useEffect(() => {
    if (!user) return
    getOrCreateProfile(user).then((profile) => {
      const nameParts = profile.name.trim().split(/\s+/)
      setForm((prev) => ({
        ...prev,
        email: user.email,
        firstName: prev.firstName || nameParts[0] || '',
        lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
        phone: prev.phone || profile.phone || '',
        address: prev.address || profile.address?.line1 || '',
        city: prev.city || profile.address?.city || '',
        state: prev.state || profile.address?.state || '',
        pincode: prev.pincode || profile.address?.pincode || '',
      }))
    })
  }, [user])

  if (!authReady) {
    return null
  }

  if (cart.length === 0 && !placed) {
    return <Navigate to="/cart" replace />
  }

  if (!user && !placed) {
    return <Navigate to="/account?redirect=/checkout" replace />
  }

  const accountEmail = user!.email

  const handleChange = (field: string, value: string) => {
    if (field === 'email') return
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const placeOrder = async (
    paymentStatus: 'paid' | 'pending',
    razorpayIds?: { paymentId?: string; orderId?: string },
    paymentScreenshotUrl?: string,
  ) => {
    const billing = { ...form, email: accountEmail }
    await createOrder({
      items: [...cart],
      billing,
      subtotal: cartTotal,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId: razorpayIds?.paymentId,
      razorpayOrderId: razorpayIds?.orderId,
      paymentScreenshotUrl,
      accountEmail,
    })
    clearCart()
    setPlacedViaUpi(paymentMethod === 'upi')
    setPlaced(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')
    setLoading(true)

    try {
      if (paymentMethod === 'upi') {
        if (!upiScreenshotUrl) {
          setPaymentError('Please upload your UPI payment screenshot before placing the order.')
          return
        }
        await placeOrder('pending', undefined, upiScreenshotUrl)
        return
      }

      if (paymentMethod === 'cod') {
        await placeOrder('pending')
        return
      }

      const result = await initiateRazorpayPayment({
        amount: cartTotal * 100,
        name: brand.name,
        description: `Order — ${cart.length} item(s)`,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: accountEmail,
          contact: form.phone,
        },
      })

      if (!result.success) {
        setPaymentError(result.error ?? 'Payment failed. Please try again.')
        return
      }

      await placeOrder('paid', { paymentId: result.paymentId, orderId: result.orderId })
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <main>
        <section className="flex min-h-[60vh] items-center justify-center py-20 pt-[var(--site-header-height)]">
          <div className="px-4 text-center">
            <CheckCircle size={56} className="mx-auto text-maroon" />
            <h1 className="mt-6 font-serif text-3xl text-charcoal">Order Placed!</h1>
            <p className="mt-3 max-w-md text-sm text-charcoal/60">
              {placedViaUpi
                ? 'Thank you! We received your order and will verify your UPI payment shortly.'
                : `Thank you for shopping with ${brand.name}. We'll contact you shortly to confirm your order.`}
            </p>
            <Link
              to="/account/orders"
              className="mt-6 inline-block text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
            >
              View Order History
            </Link>
            <Link
              to="/dress"
              className="mt-4 block text-xs text-charcoal/50 hover:text-maroon"
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
                  <label htmlFor="firstName" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    required
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    required
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="accountEmail" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Account Email
                </label>
                <input
                  id="accountEmail"
                  readOnly
                  type="email"
                  value={accountEmail}
                  className="w-full cursor-not-allowed border border-accent bg-cream-dark px-4 py-3 text-sm text-charcoal/60 outline-none"
                />
                <p className="mt-1.5 text-[10px] text-charcoal/40">
                  Your registered email is used for all orders and status updates.
                </p>
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Phone *
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Please enter a valid 10-digit phone number"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
              <div>
                <label htmlFor="address" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Street Address *
                </label>
                <input
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    City *
                  </label>
                  <input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    State *
                  </label>
                  <input
                    id="state"
                    required
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                    PIN Code *
                  </label>
                  <input
                    id="pincode"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    title="Please enter a valid 6-digit PIN code"
                    value={form.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="mb-2 block text-xs font-medium tracking-[0.15em] text-charcoal uppercase">
                  Order Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full resize-none border border-accent px-4 py-3 text-sm outline-none focus:border-maroon"
                />
              </div>
            </div>

            <PaymentMethodSelect
              value={paymentMethod}
              onChange={(method) => {
                setPaymentMethod(method)
                if (method !== 'upi') setUpiScreenshotUrl(null)
              }}
            />

            {paymentMethod === 'upi' && (
              <UpiPaymentPanel
                amount={cartTotal}
                screenshotUrl={upiScreenshotUrl}
                onScreenshotChange={setUpiScreenshotUrl}
              />
            )}

            {paymentError && <p className="text-sm text-red-500">{paymentError}</p>}

            <button
              type="submit"
              disabled={loading || (paymentMethod === 'upi' && !upiScreenshotUrl)}
              className="w-full bg-maroon py-4 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-60 sm:w-auto sm:px-12"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'razorpay'
                  ? 'Pay & Place Order'
                  : paymentMethod === 'upi'
                    ? 'I Have Paid — Place Order'
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
              <div className="mt-6">
                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
