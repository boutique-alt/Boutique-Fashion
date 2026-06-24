import { RETURN_WINDOW_DAYS } from '../data/returns'
import type { Order } from '../types/order'
import type { ReturnRequest } from '../types/return'

export type ReturnEligibility =
  | 'submitted'
  | 'eligible'
  | 'pending_delivery'
  | 'window_closed'
  | 'not_eligible'

export function getDaysSinceDelivery(order: Order): number | null {
  if (order.status !== 'delivered') return null
  const deliveredAt = order.statusUpdatedAt ?? order.createdAt
  return Math.floor((Date.now() - new Date(deliveredAt).getTime()) / 86400000)
}

export function getReturnDaysLeft(order: Order): number | null {
  const days = getDaysSinceDelivery(order)
  if (days === null) return null
  return Math.max(0, RETURN_WINDOW_DAYS - days)
}

export function getReturnEligibility(order: Order, existing?: ReturnRequest): ReturnEligibility {
  if (existing) return 'submitted'
  if (order.status === 'cancelled') return 'not_eligible'
  if (order.status === 'delivered') {
    const days = getDaysSinceDelivery(order) ?? 0
    return days <= RETURN_WINDOW_DAYS ? 'eligible' : 'window_closed'
  }
  if (order.status === 'shipped') return 'pending_delivery'
  return 'pending_delivery'
}

export function getEligibilityMessage(eligibility: ReturnEligibility, daysLeft: number | null): string {
  switch (eligibility) {
    case 'submitted':
      return 'Your return request is being processed.'
    case 'eligible':
      return daysLeft !== null && daysLeft <= RETURN_WINDOW_DAYS
        ? `Easy ${RETURN_WINDOW_DAYS}-day return — ${daysLeft} day${daysLeft === 1 ? '' : 's'} left.`
        : `Easy ${RETURN_WINDOW_DAYS}-day return on unused items with tags.`
    case 'pending_delivery':
      return 'Return available after delivery.'
    case 'window_closed':
      return 'Return window has closed for this order.'
    case 'not_eligible':
      return 'This order is not eligible for return.'
  }
}
