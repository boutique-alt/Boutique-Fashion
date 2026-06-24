import { ArrowUpRight, TrendingUp } from 'lucide-react'

interface AnalyticsStatCardProps {
  label: string
  value: string
  growth: number
}

export default function AnalyticsStatCard({ label, value, growth }: AnalyticsStatCardProps) {
  const positive = growth >= 0

  return (
    <div className="rounded-xl border border-accent/60 bg-cream p-5 shadow-sm">
      <div className="flex items-center gap-2 text-charcoal/60">
        <TrendingUp size={16} strokeWidth={1.5} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-4 font-serif text-3xl font-semibold tracking-tight text-charcoal">{value}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-xs font-medium ${positive ? 'text-emerald-600' : 'text-gold'}`}>
          {positive ? '+' : ''}{growth}% {positive ? 'Increased' : 'Decreased'} Recently
        </p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${positive ? 'bg-emerald-500' : 'bg-gold'}`}>
          <ArrowUpRight size={16} className="text-cream" />
        </span>
      </div>
    </div>
  )
}
