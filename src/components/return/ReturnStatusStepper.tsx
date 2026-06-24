import type { ReturnStatus } from '../../types/return'
import { RETURN_STATUS_LABELS } from '../../types/return'

const steps: ReturnStatus[] = ['requested', 'approved', 'picked_up', 'refunded']

interface ReturnStatusStepperProps {
  status: ReturnStatus
}

export default function ReturnStatusStepper({ status }: ReturnStatusStepperProps) {
  if (status === 'rejected') {
    return (
      <p className="text-xs text-charcoal/50">Return request was not approved. Contact customer care for help.</p>
    )
  }

  const activeIndex = steps.indexOf(status)

  return (
    <ol className="flex flex-wrap items-center gap-1">
      {steps.map((step, i) => {
        const done = i <= activeIndex
        const current = i === activeIndex
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
              {RETURN_STATUS_LABELS[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
