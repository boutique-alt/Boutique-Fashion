import { useState, Fragment } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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
  const [expanded, setExpanded] = useState(false)

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
    <Fragment>
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
        {order.paymentScreenshotUrl && (
          <a
            href={order.paymentScreenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-[10px] text-maroon hover:underline"
          >
            View screenshot
          </a>
        )}
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
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-maroon hover:text-maroon-light transition-colors"
          >
            {expanded ? (
              <>
                Hide <ChevronUp size={14} />
              </>
            ) : (
              <>
                View <ChevronDown size={14} />
              </>
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-cream-dark/30 border-b border-accent">
          <td colSpan={8} className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-serif text-charcoal mb-3">Order Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b border-accent/50 pb-4 last:border-0 last:pb-0">
                      {item.image && (
                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden bg-cream-dark">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                           loading="lazy" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-sm font-medium text-charcoal">{item.name}</p>
                        {item.size && (
                          <p className="text-xs text-charcoal/60">Size: {item.size}</p>
                        )}
                        <p className="text-xs text-charcoal/60">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="text-sm font-medium text-charcoal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="font-serif text-charcoal mb-3">Customer Details</h4>
                  <div className="text-sm text-charcoal/80 space-y-1">
                    <p><span className="font-medium">Name:</span> {order.billing.firstName} {order.billing.lastName}</p>
                    <p><span className="font-medium">Email:</span> {order.billing.email}</p>
                    <p><span className="font-medium">Phone:</span> {order.billing.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-charcoal mb-3">Pickup / Delivery Location</h4>
                  <div className="text-sm text-charcoal/80 space-y-1">
                    <p>{order.billing.address}</p>
                    <p>{order.billing.city}, {order.billing.state} {order.billing.pincode}</p>
                    {order.billing.notes && (
                      <p className="mt-2 text-charcoal/60 italic">Notes: {order.billing.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
