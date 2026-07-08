import { useEffect, useMemo, useState } from 'react'
import type { AnalyticsPeriod } from '../../types/analytics'
import AnalyticsStatCard from '../../components/admin/analytics/AnalyticsStatCard'
import AnalyticsVisitChart from '../../components/admin/analytics/AnalyticsVisitChart'
import AnalyticsRecentActivity from '../../components/admin/analytics/AnalyticsRecentActivity'
import AnalyticsPeriodTabs from '../../components/admin/analytics/AnalyticsPeriodTabs'
import AnalyticsMonthlyStats from '../../components/admin/analytics/AnalyticsMonthlyStats'
import AnalyticsProductViews from '../../components/admin/analytics/AnalyticsProductViews'
import {
  getChartData,
  getMonthlyExtremes,
  getPeriodVisitCount,
  getProductViewStats,
  getVisitGrowthPercent,
  loadPageVisits,
} from '../../services/analyticsService'
import { getOrders, loadOrders } from '../../services/orderService'

function getOrderGrowthPercent(): number {
  const orders = getOrders()
  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000
  const recent = orders.filter((o) => now - new Date(o.createdAt).getTime() <= week).length
  const previous = orders.filter((o) => {
    const age = now - new Date(o.createdAt).getTime()
    return age > week && age <= week * 2
  }).length
  if (previous === 0) return recent > 0 ? 100 : 0
  return Math.round(((recent - previous) / previous) * 100)
}

const chartTitles: Record<AnalyticsPeriod, string> = {
  '1h': 'Traffic — Last Hour',
  'today': 'Traffic — Today',
  '7d': 'Traffic — Last 7 Days',
  '15d': 'Traffic — Last 15 Days',
  '30d': 'Traffic — Last 30 Days',
  '6m': 'Traffic — Last 6 Months',
  '1y': 'Traffic — Last 1 Year',
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([loadPageVisits(), loadOrders()]).finally(() => setReady(true))
  }, [])

  const orders = getOrders()

  const chartData = useMemo(() => getChartData(period), [period])
  const extremes = useMemo(() => getMonthlyExtremes(period), [period])
  const productViews = useMemo(() => getProductViewStats(period), [period])
  const periodVisits = useMemo(() => getPeriodVisitCount(period), [period])
  const visitGrowth = useMemo(() => getVisitGrowthPercent(period), [period])

  const paidRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)

  if (!ready) return null

  return (
    <div className="min-h-full bg-cream-dark/40 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Analytics</h1>
          <p className="mt-1 text-sm text-charcoal/60">Store performance overview</p>
        </div>
        <AnalyticsPeriodTabs value={period} onChange={setPeriod} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <AnalyticsStatCard
              label="Page Visits"
              value={periodVisits.toLocaleString('en-IN')}
              growth={visitGrowth}
            />
            <AnalyticsStatCard
              label="Store Revenue"
              value={`₹${paidRevenue.toLocaleString('en-IN')}`}
              growth={getOrderGrowthPercent()}
            />
          </div>
          <AnalyticsVisitChart data={chartData} title={chartTitles[period]} />
          <AnalyticsMonthlyStats highest={extremes.highest} lowest={extremes.lowest} />
          <AnalyticsProductViews products={productViews} />
        </div>

        <div className="min-w-0">
          <AnalyticsRecentActivity />
        </div>
      </div>
    </div>
  )
}
