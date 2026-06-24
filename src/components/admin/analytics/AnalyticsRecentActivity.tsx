import { useState } from 'react'
import { getOrders } from '../../../services/orderService'
import { getReturns } from '../../../services/returnService'
import { formatPageLabel, formatTimeAgo, getRecentVisits } from '../../../services/analyticsService'

type ActivityTab = 'visits' | 'orders' | 'returns'

interface ActivityItem {
  id: string
  initials: string
  title: string
  subtitle: string
  time: string
}

const tabs: { id: ActivityTab; label: string }[] = [
  { id: 'visits', label: 'Visits' },
  { id: 'orders', label: 'Orders' },
  { id: 'returns', label: 'Returns' },
]

function getActivities(tab: ActivityTab): ActivityItem[] {
  if (tab === 'visits') {
    return getRecentVisits(6).map((v) => ({
      id: v.timestamp + v.path,
      initials: 'BF',
      title: `Visited ${formatPageLabel(v.path)}`,
      subtitle: v.path,
      time: formatTimeAgo(v.timestamp),
    }))
  }

  if (tab === 'orders') {
    return getOrders()
      .slice(0, 6)
      .map((o) => ({
        id: o.id,
        initials: o.billing.firstName.slice(0, 1).toUpperCase() + (o.billing.lastName.slice(0, 1).toUpperCase() || ''),
        title: `${o.billing.firstName} placed an order`,
        subtitle: `₹${o.total.toLocaleString('en-IN')} · ${o.status}`,
        time: formatTimeAgo(o.createdAt),
      }))
  }

  return getReturns()
    .slice(0, 6)
    .map((r) => ({
      id: r.id,
      initials: r.email.slice(0, 2).toUpperCase(),
      title: 'Return request submitted',
      subtitle: `${r.email} · ${r.status}`,
      time: formatTimeAgo(r.createdAt),
    }))
}

export default function AnalyticsRecentActivity() {
  const [tab, setTab] = useState<ActivityTab>('visits')
  const activities = getActivities(tab)

  return (
    <div className="rounded-xl border border-accent/60 bg-cream p-5 shadow-sm">
      <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Activities</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === id
                ? 'bg-maroon text-cream'
                : 'border border-maroon/30 text-maroon hover:bg-maroon/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-4">
        {activities.length === 0 ? (
          <li className="py-8 text-center text-sm text-charcoal/50">No activity yet.</li>
        ) : (
          activities.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-[11px] font-semibold text-maroon">
                {item.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-charcoal">
                  <span className="font-semibold">{item.title}</span>
                </p>
                <p className="truncate text-xs text-charcoal/50">{item.subtitle}</p>
                <p className="mt-0.5 text-[10px] text-charcoal/40">{item.time}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
