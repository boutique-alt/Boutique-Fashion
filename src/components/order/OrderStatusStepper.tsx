import type { OrderStatus } from '../../types/order'
import { ORDER_STATUS_LABELS } from '../../types/order'

const steps: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered']

interface OrderStatusStepperProps {
  status: OrderStatus
}

export default function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  if (status === 'cancelled') {
    return (
      <p className="text-xs text-charcoal/50">This order was cancelled. Contact customer care if you need help.</p>
    )
  }

  const activeIndex = steps.indexOf(status)
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0

  return (
    <ol className="mt-3 flex flex-wrap items-center gap-1">
      {steps.map((step, i) => {
        const done = i <= resolvedIndex
        const current = i === resolvedIndex
        return (
          <li key={step} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1 text-charcoal/20">—</span>}
            <span
              className={`flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase ${
                done ? 'text-maroon' : 'text-charcoal/30'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  current ? 'bg-maroon ring-2 ring-maroon/20' : done ? 'bg-maroon' : 'bg-charcoal/20'
                }`}
              />
              {ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
