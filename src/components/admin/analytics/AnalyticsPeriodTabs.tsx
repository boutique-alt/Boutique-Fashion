import type { AnalyticsPeriod } from '../../../types/analytics'
import { ANALYTICS_PERIODS } from '../../../types/analytics'

interface AnalyticsPeriodTabsProps {
  value: AnalyticsPeriod
  onChange: (period: AnalyticsPeriod) => void
}

export default function AnalyticsPeriodTabs({ value, onChange }: AnalyticsPeriodTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ANALYTICS_PERIODS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            value === id
              ? 'bg-maroon text-cream'
              : 'border border-maroon/30 text-maroon hover:bg-maroon/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
