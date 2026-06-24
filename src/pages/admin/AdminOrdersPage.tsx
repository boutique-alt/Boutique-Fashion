import { useEffect, useState } from 'react'
import AdminOrderRow from '../../components/admin/AdminOrderRow'
import { loadOrders, getOrders } from '../../services/orderService'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => getOrders())
  const [version, setVersion] = useState(0)

  useEffect(() => {
    loadOrders().then(setOrders)
  }, [])

  const refresh = async () => {
    setOrders(await loadOrders())
    setVersion((v) => v + 1)
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-charcoal/60">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <div className="mt-12 border border-dashed border-accent py-16 text-center">
          <p className="text-sm text-charcoal/50">No orders yet. Orders appear here after checkout.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[800px] border border-accent text-sm">
            <thead className="bg-cream-dark text-left text-xs tracking-wide text-charcoal/60 uppercase">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <AdminOrderRow key={`${order.id}-${version}`} order={order} onSaved={refresh} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
