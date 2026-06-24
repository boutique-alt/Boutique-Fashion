export interface PageVisit {
  path: string
  timestamp: string
  productSlug?: string
  productName?: string
}

export type AnalyticsPeriod = '1h' | 'today' | '7d' | '15d' | '30d' | '6m' | '1y'

export interface AnalyticsPeriodOption {
  id: AnalyticsPeriod
  label: string
}

export const ANALYTICS_PERIODS: AnalyticsPeriodOption[] = [
  { id: '1h', label: 'Last Hour' },
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '15d', label: '15 Days' },
  { id: '30d', label: '30 Days' },
  { id: '6m', label: '6 Months' },
  { id: '1y', label: '1 Year' },
]

export interface ChartPoint {
  date: string
  label: string
  count: number
}

export interface ProductViewStat {
  slug: string
  name: string
  count: number
}

export interface MonthlyVisitStat {
  month: string
  label: string
  count: number
}
