import { useState } from 'react'
import type { ChartPoint } from '../../../types/analytics'

interface AnalyticsVisitChartProps {
  data: ChartPoint[]
  title?: string
}

export default function AnalyticsVisitChart({ data, title = 'Traffic Overview' }: AnalyticsVisitChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const width = 520
  const height = 220
  const padX = 48
  const padY = 28
  const chartW = width - padX * 2
  const chartH = height - padY * 2
  const maxVal = Math.max(...data.map((d) => d.count), 1)

  const points = data.map((d, i) => {
    const x = padX + (data.length > 1 ? i / (data.length - 1) : 0.5) * chartW
    const y = padY + chartH - (d.count / maxVal) * chartH
    return { ...d, x, y, i }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const active = activeIndex !== null ? points[activeIndex] : null
  const peakIndex = points.reduce((best, p, i) => (p.count > points[best].count ? i : best), 0)
  const showPeak = activeIndex === null && points[peakIndex].count > 0

  const yLabels = [maxVal, Math.round(maxVal * 0.66), Math.round(maxVal * 0.33), 0]

  return (
    <div className="rounded-xl border border-accent/60 bg-cream p-6 shadow-sm">
      <h2 className="font-serif text-xl font-semibold text-charcoal">{title}</h2>
      <div className="relative mt-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          onMouseLeave={() => setActiveIndex(null)}
        >
          {yLabels.map((val, i) => {
            const y = padY + (i / (yLabels.length - 1)) * chartH
            return (
              <g key={val}>
                <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#e8e4df" strokeWidth="1" />
                <text x={padX - 8} y={y + 4} textAnchor="end" className="fill-charcoal/40 text-[9px]">
                  {val}
                </text>
              </g>
            )
          })}

          {points.map((p) => (
            <text
              key={p.date}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-charcoal/50 text-[9px]"
            >
              {p.label}
            </text>
          ))}

          <path d={linePath} fill="none" stroke="#2f4799" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p) => (
            <circle
              key={p.date}
              cx={p.x}
              cy={p.y}
              r={activeIndex === p.i ? 6 : 4}
              fill="#2f4799"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setActiveIndex(p.i)}
            />
          ))}

          {active && (
            <g>
              <line x1={active.x} y1={padY} x2={active.x} y2={padY + chartH} stroke="#2f4799" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
            </g>
          )}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute rounded-lg border border-accent/60 bg-cream px-3 py-2 shadow-md"
            style={{ left: `${(active.x / width) * 100}%`, top: `${(active.y / height) * 100 - 18}%`, transform: 'translateX(-50%)' }}
          >
            <p className="text-[10px] font-medium text-maroon">{active.count} visits</p>
            <p className="text-[9px] text-charcoal/50">{active.label}</p>
          </div>
        )}

        {showPeak && (
          <div
            className="pointer-events-none absolute rounded-lg border border-accent/60 bg-cream px-3 py-1.5 shadow-sm"
            style={{ left: `${(points[peakIndex].x / width) * 100}%`, top: `${(points[peakIndex].y / height) * 100 - 22}%`, transform: 'translateX(-30%)' }}
          >
            <p className="text-[10px] font-medium text-maroon">Peak Traffic</p>
          </div>
        )}
      </div>
    </div>
  )
}
