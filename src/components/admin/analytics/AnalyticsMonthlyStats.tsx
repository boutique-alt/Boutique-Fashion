import type { MonthlyVisitStat } from '../../../types/analytics'

interface AnalyticsMonthlyStatsProps {
  highest: MonthlyVisitStat | null
  lowest: MonthlyVisitStat | null
}

export default function AnalyticsMonthlyStats({ highest, lowest }: AnalyticsMonthlyStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-accent/60 bg-cream p-5 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-charcoal/50 uppercase">Highest Visitor Month</p>
        {highest ? (
          <>
            <p className="mt-2 font-serif text-2xl text-maroon">{highest.count.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm text-charcoal/70">{highest.label}</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-charcoal/50">No data yet</p>
        )}
      </div>
      <div className="rounded-xl border border-accent/60 bg-cream p-5 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-charcoal/50 uppercase">Lowest Visitor Month</p>
        {lowest ? (
          <>
            <p className="mt-2 font-serif text-2xl text-charcoal">{lowest.count.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm text-charcoal/70">{lowest.label}</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-charcoal/50">No data yet</p>
        )}
      </div>
    </div>
  )
}
