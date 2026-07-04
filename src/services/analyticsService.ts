import type {
  AnalyticsPeriod,
  ChartPoint,
  MonthlyVisitStat,
  PageVisit,
  ProductViewStat,
} from '../types/analytics'
import { isSupabaseConfigured } from '../config/env'
import { getProductBySlug } from '../data/productCatalog'
import { getSupabase } from '../lib/supabase'
import { mapPageVisit, type DbPageVisit } from '../lib/supabaseMappers'
import { getSupabaseForAdminData } from './adminDataClient'

let visitsCache: PageVisit[] | null = null

export async function loadPageVisits(): Promise<PageVisit[]> {
  if (!isSupabaseConfigured()) {
    visitsCache = []
    return []
  }

  const adminClient = await getSupabaseForAdminData()
  if (!adminClient) {
    visitsCache = []
    return []
  }

  const { data } = await adminClient
    .from('page_visits')
    .select('path, product_slug, product_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5000)

  visitsCache = data ? (data as DbPageVisit[]).map(mapPageVisit) : []
  return visitsCache
}

export function getPageVisits(): PageVisit[] {
  return visitsCache ?? []
}

export function trackPageVisit(
  path: string,
  meta?: { productSlug?: string; productName?: string },
): void {
  const visit: PageVisit = {
    path,
    timestamp: new Date().toISOString(),
    productSlug: meta?.productSlug,
    productName: meta?.productName,
  }

  visitsCache = [...(visitsCache ?? []), visit]

  if (!isSupabaseConfigured()) return

  void getSupabase()
    .from('page_visits')
    .insert({
      path,
      product_slug: meta?.productSlug ?? null,
      product_name: meta?.productName ?? null,
    })
    .then(({ error }) => {
      if (error) visitsCache = visitsCache?.filter((v) => v !== visit) ?? null
    })
}

function getPeriodCutoff(period: AnalyticsPeriod): number {
  const now = new Date()
  if (period === '1h') return Date.now() - 3600000
  if (period === 'today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return start.getTime()
  }
  const days: Record<Exclude<AnalyticsPeriod, '1h' | 'today'>, number> = {
    '7d': 7,
    '15d': 15,
    '30d': 30,
    '6m': 180,
    '1y': 365,
  }
  return Date.now() - days[period] * 86400000
}

export function filterVisitsByPeriod(visits: PageVisit[], period: AnalyticsPeriod): PageVisit[] {
  const cutoff = getPeriodCutoff(period)
  return visits.filter((v) => new Date(v.timestamp).getTime() >= cutoff)
}

function getChartDataLastHour(visits: PageVisit[]): ChartPoint[] {
  const buckets = 12
  const result: ChartPoint[] = []
  const now = Date.now()

  for (let i = buckets - 1; i >= 0; i--) {
    const bucketEnd = now - i * 5 * 60000
    const bucketStart = bucketEnd - 5 * 60000
    const count = visits.filter((v) => {
      const t = new Date(v.timestamp).getTime()
      return t >= bucketStart && t < bucketEnd
    }).length
    result.push({
      date: new Date(bucketStart).toISOString(),
      label: new Date(bucketStart).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
      count,
    })
  }
  return result
}

function getChartDataToday(visits: PageVisit[]): ChartPoint[] {
  const now = new Date()
  const currentHour = now.getHours()
  const today = now.toISOString().slice(0, 10)
  const result: ChartPoint[] = []

  for (let h = 0; h <= currentHour; h++) {
    const count = visits.filter((v) => {
      if (v.timestamp.slice(0, 10) !== today) return false
      return new Date(v.timestamp).getHours() === h
    }).length
    const d = new Date(now)
    d.setHours(h, 0, 0, 0)
    result.push({
      date: d.toISOString(),
      label: d.toLocaleTimeString('en-IN', { hour: 'numeric' }),
      count,
    })
  }
  return result
}

export function getChartData(period: AnalyticsPeriod): ChartPoint[] {
  const visits = filterVisitsByPeriod(getPageVisits(), period)

  if (period === '1h') return getChartDataLastHour(visits)
  if (period === 'today') return getChartDataToday(visits)

  const useMonthly = period === '6m' || period === '1y'

  if (useMonthly) {
    const months = period === '6m' ? 6 : 12
    const result: ChartPoint[] = []
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      const key = d.toISOString().slice(0, 7)
      const count = visits.filter((v) => v.timestamp.slice(0, 7) === key).length
      result.push({
        date: `${key}-01`,
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        count,
      })
    }
    return result
  }

  const days = period === '7d' ? 7 : period === '15d' ? 15 : 30
  const result: ChartPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    const count = visits.filter((v) => v.timestamp.slice(0, 10) === date).length
    const label =
      days <= 7
        ? d.toLocaleDateString('en-IN', { weekday: 'short' })
        : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    result.push({ date, label, count })
  }
  return result
}

export function getMonthlyVisitStats(period: AnalyticsPeriod): MonthlyVisitStat[] {
  const visits = filterVisitsByPeriod(getPageVisits(), period)
  const map = new Map<string, number>()

  for (const v of visits) {
    const key = v.timestamp.slice(0, 7)
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  return [...map.entries()]
    .map(([month, count]) => ({
      month,
      label: new Date(`${month}-01`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

export function getMonthlyExtremes(period: AnalyticsPeriod): {
  highest: MonthlyVisitStat | null
  lowest: MonthlyVisitStat | null
} {
  const stats = getMonthlyVisitStats(period).filter((s) => s.count > 0)
  if (stats.length === 0) return { highest: null, lowest: null }
  return {
    highest: stats.reduce((a, b) => (b.count > a.count ? b : a)),
    lowest: stats.reduce((a, b) => (b.count < a.count ? b : a)),
  }
}

export function getProductViewStats(period: AnalyticsPeriod, limit = 10): ProductViewStat[] {
  const visits = filterVisitsByPeriod(getPageVisits(), period)
  const counts = new Map<string, { name: string; count: number }>()

  for (const v of visits) {
    let slug = v.productSlug
    let name = v.productName

    if (!slug) {
      const match = v.path.match(/^\/product\/([^/]+)/)
      if (!match) continue
      slug = match[1]
    }

    if (!name) {
      name = getProductBySlug(slug)?.name ?? slug.replace(/-/g, ' ')
    }

    const existing = counts.get(slug)
    if (existing) {
      existing.count += 1
    } else {
      counts.set(slug, { name, count: 1 })
    }
  }

  return [...counts.entries()]
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getPeriodVisitCount(period: AnalyticsPeriod): number {
  return filterVisitsByPeriod(getPageVisits(), period).length
}

export function getVisitGrowthPercent(period: AnalyticsPeriod): number {
  const visits = getPageVisits()
  const now = Date.now()
  const cutoff = getPeriodCutoff(period)
  const inPeriod = visits.filter((v) => new Date(v.timestamp).getTime() >= cutoff)

  if (period === '1h') {
    const half = 30 * 60000
    const recent = inPeriod.filter((v) => now - new Date(v.timestamp).getTime() <= half).length
    const previous = inPeriod.filter((v) => {
      const age = now - new Date(v.timestamp).getTime()
      return age > half && age <= 3600000
    }).length
    if (previous === 0) return recent > 0 ? 100 : 0
    return Math.round(((recent - previous) / previous) * 100)
  }

  if (period === 'today') {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const elapsed = now - start.getTime()
    const half = elapsed / 2
    const recent = inPeriod.filter((v) => now - new Date(v.timestamp).getTime() <= half).length
    const previous = inPeriod.filter((v) => {
      const age = now - new Date(v.timestamp).getTime()
      return age > half
    }).length
    if (previous === 0) return recent > 0 ? 100 : 0
    return Math.round(((recent - previous) / previous) * 100)
  }

  const days = period === '7d' ? 7 : period === '15d' ? 15 : period === '30d' ? 30 : period === '6m' ? 180 : 365
  const half = Math.floor(days / 2)

  const recent = visits.filter((v) => {
    const age = now - new Date(v.timestamp).getTime()
    return age <= half * 86400000
  }).length

  const previous = visits.filter((v) => {
    const age = now - new Date(v.timestamp).getTime()
    return age > half * 86400000 && age <= days * 86400000
  }).length

  if (previous === 0) return recent > 0 ? 100 : 0
  return Math.round(((recent - previous) / previous) * 100)
}

export function getRecentVisits(limit = 8) {
  return [...getPageVisits()]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function formatPageLabel(path: string): string {
  if (path === '/') return 'Home'
  return path.replace(/^\//, '').replace(/-/g, ' ')
}

export function getTodayVisitCount(): number {
  const today = new Date().toISOString().slice(0, 10)
  return getPageVisits().filter((v) => v.timestamp.slice(0, 10) === today).length
}

export function getUniquePageCount(): number {
  return new Set(getPageVisits().map((v) => v.path)).size
}

export function getTopPages(limit = 5): { path: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const v of getPageVisits()) {
    counts.set(v.path, (counts.get(v.path) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getVisitsByDay(days = 7): { date: string; count: number }[] {
  const period: AnalyticsPeriod =
    days <= 7 ? '7d' : days <= 15 ? '15d' : days <= 30 ? '30d' : days <= 180 ? '6m' : '1y'
  return getChartData(period).map(({ date, count }) => ({ date, count }))
}
