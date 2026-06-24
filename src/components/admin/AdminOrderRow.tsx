import { useState } from 'react'
import { updateOrderStatus } from '../../services/orderService'
import type { Order, OrderStatus } from '../../types/order'
import { isOrderStatusLocked } from '../../types/order'
import OrderStatusBadge from '../order/OrderStatusBadge'

const statusOptions: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

interface AdminOrderRowProps {
  order: Order
  onSaved: () => void
}

export default function AdminOrderRow({ order, onSaved }: AdminOrderRowProps) {
  const locked = isOrderStatusLocked(order.status)
  const [draftStatus, setDraftStatus] = useState<OrderStatus>(order.status)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const hasChanges = draftStatus !== order.status

  const handleSave = async () => {
    setError('')
    if (!hasChanges || locked) return

    const ok = await updateOrderStatus(order.id, draftStatus)
    if (!ok) {
      setError('Status cannot be changed')
      setDraftStatus(order.status)
      return
    }

    setSaved(true)
    onSaved()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <tr className="border-t border-accent">
      <td className="px-4 py-3 font-mono text-xs text-charcoal/70">
        {order.id.slice(0, 12)}…
      </td>
      <td className="px-4 py-3">
        <p className="text-charcoal">{order.billing.firstName} {order.billing.lastName}</p>
        <p className="text-xs text-charcoal/50">{order.billing.email}</p>
      </td>
      <td className="px-4 py-3 text-charcoal/70">
        {order.items.reduce((s, i) => s + i.quantity, 0)} items
      </td>
      <td className="px-4 py-3 font-medium text-charcoal">
        ₹{order.total.toLocaleString('en-IN')}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs uppercase">{order.paymentMethod}</span>
        <span className={`ml-2 text-xs ${order.paymentStatus === 'paid' ? 'text-maroon' : 'text-gold'}`}>
          {order.paymentStatus}
        </span>
      </td>
      <td className="px-4 py-3">
        {locked ? (
          <div>
            <OrderStatusBadge status={order.status} />
            <p className="mt-1 text-[10px] text-charcoal/40">Final — cannot be changed</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <select
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value as OrderStatus)}
              className="border border-accent bg-cream px-2 py-1 text-xs outline-none focus:border-maroon"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {hasChanges && (
              <button
                type="button"
                onClick={handleSave}
                className="bg-maroon px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-cream uppercase transition-colors hover:bg-maroon-light"
              >
                Save
              </button>
            )}
            {saved && <span className="text-[10px] text-maroon">Saved!</span>}
            {error && <span className="text-[10px] text-gold">{error}</span>}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-charcoal/50">
        {new Date(order.createdAt).toLocaleDateString('en-IN')}
      </td>
    </tr>
  )
}
