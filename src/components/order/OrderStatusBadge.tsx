import type { OrderStatus } from '../../types/order'
import { isOrderStatusLocked } from '../../types/order'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-charcoal/10 text-charcoal/70',
  paid: 'bg-maroon/10 text-maroon',
  processing: 'bg-maroon/10 text-maroon',
  shipped: 'bg-gold/15 text-gold',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-charcoal/10 text-charcoal/50 line-through',
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] uppercase ${statusStyles[status]}`}
    >
      {status}
      {isOrderStatusLocked(status) && status === 'delivered' ? ' ✓' : ''}
    </span>
  )
}

export function formatOrderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
