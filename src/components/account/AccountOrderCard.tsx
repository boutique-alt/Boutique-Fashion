import type { Order } from '../../types/order'
import OrderStatusBadge from '../order/OrderStatusBadge'
import OrderStatusStepper from '../order/OrderStatusStepper'
import ReturnRequestButton from '../return/ReturnRequestButton'

interface AccountOrderCardProps {
  order: Order
  email: string
}

export default function AccountOrderCard({ order, email }: AccountOrderCardProps) {
  return (
    <div className="border border-accent p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-charcoal/50">
          {new Date(order.createdAt).toLocaleDateString('en-IN')}
        </p>
        <OrderStatusBadge status={order.status} />
      </div>
      {order.statusUpdatedAt && (
        <p className="mt-1 text-[10px] text-charcoal/40">
          Status updated {new Date(order.statusUpdatedAt).toLocaleString('en-IN')}
        </p>
      )}
      <OrderStatusStepper status={order.status} />
      <ul className="mt-3 space-y-1 text-sm text-charcoal/70">
        {order.items.map((item) => (
          <li key={item.key}>
            {item.name} × {item.quantity}
            <span className="text-charcoal/40"> · Size {item.size}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-medium text-charcoal">
        ₹{order.total.toLocaleString('en-IN')} · {order.paymentMethod}
      </p>
      <ReturnRequestButton order={order} email={email} />
    </div>
  )
}
