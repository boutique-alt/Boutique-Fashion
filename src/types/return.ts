export type ReturnStatus = 'requested' | 'approved' | 'picked_up' | 'refunded' | 'rejected'

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  requested: 'Requested',
  approved: 'Approved',
  picked_up: 'Picked Up',
  refunded: 'Refunded',
  rejected: 'Rejected',
}

export interface ReturnRequest {
  id: string
  orderId: string
  email: string
  reason: string
  status: ReturnStatus
  createdAt: string
  statusUpdatedAt?: string
}
