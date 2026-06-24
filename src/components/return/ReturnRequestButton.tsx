import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, RotateCcw } from 'lucide-react'
import type { Order } from '../../types/order'
import type { ReturnRequest } from '../../types/return'
import { RETURN_REASONS } from '../../data/returns'
import { createReturnRequest, fetchReturnByOrderId } from '../../services/returnService'
import {
  getEligibilityMessage,
  getReturnDaysLeft,
  getReturnEligibility,
} from '../../utils/returnEligibility'
import ReturnStatusBadge from './ReturnStatusBadge'
import ReturnStatusStepper from './ReturnStatusStepper'

interface ReturnRequestButtonProps {
  order: Order
  email: string
  onRequested?: () => void
}

export default function ReturnRequestButton({ order, email, onRequested }: ReturnRequestButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [existing, setExisting] = useState<ReturnRequest | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchReturnByOrderId(order.id, email).then((request) => {
      if (!cancelled) {
        setExisting(request)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [order.id, email])

  const eligibility = getReturnEligibility(order, existing)
  const daysLeft = getReturnDaysLeft(order)
  const message = getEligibilityMessage(eligibility, daysLeft)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      setError('Please select a reason for the return.')
      return
    }
    const fullReason = details.trim() ? `${reason}: ${details.trim()}` : reason
    const created = await createReturnRequest({ orderId: order.id, email, reason: fullReason })
    if (!created) {
      const found = await fetchReturnByOrderId(order.id, email)
      if (found) {
        setExisting(found)
        setOpen(false)
        return
      }
      setError('Could not submit return request. Please try again.')
      return
    }
    setExisting(created)
    setOpen(false)
    onRequested?.()
  }

  if (loading) {
    return (
      <div className="mt-4 border-t border-accent pt-4">
        <p className="text-xs text-charcoal/40">Checking return status...</p>
      </div>
    )
  }

  if (eligibility === 'submitted' && existing) {
    return (
      <div className="mt-4 space-y-3 border-t border-accent pt-4">
        <div className="flex items-start gap-2 text-maroon">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-sm font-medium text-charcoal">Return request submitted</p>
            <p className="mt-1 text-xs text-charcoal/50">
              We&apos;ll review within 48 hours. Refund in 7–10 days after pickup.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-charcoal/50">Return status:</span>
          <ReturnStatusBadge status={existing.status} />
        </div>
        <ReturnStatusStepper status={existing.status} />
        <Link
          to="/account/returns"
          className="inline-block text-[10px] font-medium tracking-[0.1em] text-maroon uppercase hover:text-maroon-light"
        >
          View details
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-4 border-t border-accent pt-4">
      <p className={`text-xs ${eligibility === 'eligible' ? 'text-maroon' : 'text-charcoal/50'}`}>
        {message}
      </p>

      {eligibility === 'eligible' && (
        <>
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 flex items-center gap-2 bg-maroon px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-cream uppercase transition-colors hover:bg-maroon-light"
            >
              <RotateCcw size={14} />
              Return / Exchange
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.1em] text-charcoal uppercase">
                  Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setError('') }}
                  className="w-full border border-accent bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-maroon"
                >
                  <option value="">Select a reason</option>
                  {RETURN_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium tracking-[0.1em] text-charcoal uppercase">
                  Additional details (optional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full resize-none border border-accent px-3 py-2 text-sm outline-none focus:border-maroon"
                  placeholder="Any extra information..."
                />
              </div>
              {error && <p className="text-xs text-gold">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-maroon px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setError('') }}
                  className="px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase hover:text-charcoal"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[10px] text-charcoal/40">
                Unused items with tags.{' '}
                <Link to="/contact-us" className="text-maroon hover:text-maroon-light">
                  Read return policy
                </Link>
              </p>
            </form>
          )}
        </>
      )}

      {eligibility === 'window_closed' && (
        <Link
          to="/contact-us"
          className="mt-2 inline-block text-[10px] font-medium tracking-[0.1em] text-maroon uppercase hover:text-maroon-light"
        >
          Read return policy
        </Link>
      )}
    </div>
  )
}
