import { RETURN_STATUS_LABELS, type ReturnStatus } from '../../types/return'

const statusStyles: Record<ReturnStatus, string> = {
  requested: 'bg-gold/15 text-gold',
  approved: 'bg-maroon/10 text-maroon',
  picked_up: 'bg-charcoal/10 text-charcoal',
  refunded: 'bg-maroon/15 text-maroon',
  rejected: 'bg-charcoal/10 text-charcoal/60',
}

interface ReturnStatusBadgeProps {
  status: ReturnStatus
}

export default function ReturnStatusBadge({ status }: ReturnStatusBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase ${statusStyles[status]}`}>
      {RETURN_STATUS_LABELS[status]}
    </span>
  )
}
