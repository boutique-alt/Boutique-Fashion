import { useEffect, useState } from 'react'
import { getReturns, loadReturns, updateReturnStatus } from '../../services/returnService'
import { getOrders, loadOrders } from '../../services/orderService'
import ReturnStatusBadge from '../../components/return/ReturnStatusBadge'
import type { Order } from '../../types/order'
import type { ReturnRequest, ReturnStatus } from '../../types/return'

const statusOptions: ReturnStatus[] = ['requested', 'approved', 'picked_up', 'refunded', 'rejected']

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>(() => getReturns())
  const [orders, setOrders] = useState<Order[]>(() => getOrders())

  useEffect(() => {
    loadReturns().then(setReturns)
    loadOrders().then(setOrders)
  }, [])

  const refresh = async () => {
    setReturns(await loadReturns())
  }

  const handleStatusChange = async (id: string, status: ReturnStatus) => {
    if (await updateReturnStatus(id, status)) await refresh()
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-charcoal">Returns</h1>
      <p className="mt-1 text-sm text-charcoal/60">{returns.length} return requests</p>

      {returns.length === 0 ? (
        <div className="mt-12 border border-dashed border-accent py-16 text-center">
          <p className="text-sm text-charcoal/50">No return requests yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px] border border-accent text-sm">
            <thead className="bg-cream-dark text-left text-xs tracking-wide text-charcoal/60 uppercase">
              <tr>
                <th className="px-4 py-3">Return ID</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => {
                const order = orders.find((o) => o.id === ret.orderId)
                return (
                  <tr key={ret.id} className="border-t border-accent">
                    <td className="px-4 py-3 text-xs text-charcoal/50">{ret.id.slice(0, 12)}…</td>
                    <td className="px-4 py-3 text-xs">{order ? `₹${order.total.toLocaleString('en-IN')}` : ret.orderId.slice(0, 8)}</td>
                    <td className="px-4 py-3">{ret.email}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-charcoal/70">{ret.reason}</td>
                    <td className="px-4 py-3">
                      <select
                        value={ret.status}
                        onChange={(e) => handleStatusChange(ret.id, e.target.value as ReturnStatus)}
                        className="border border-accent bg-cream px-2 py-1 text-xs outline-none focus:border-maroon"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="mt-1">
                        <ReturnStatusBadge status={ret.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal/50">
                      {new Date(ret.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
