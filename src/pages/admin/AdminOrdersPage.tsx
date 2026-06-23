import { useState } from 'react'
import { getOrders, updateOrderStatus } from '../../services/orderService'
import type { OrderStatus } from '../../types/order'

const statusOptions: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => getOrders())

  const refresh = () => setOrders(getOrders())

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    refresh()
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
                <tr key={order.id} className="border-t border-accent">
                  <td className="px-4 py-3 font-mono text-xs text-charcoal/70">
                    {order.id.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-charcoal">{order.billing.firstName} {order.billing.lastName}</p>
                    <p className="text-xs text-charcoal/50">{order.billing.email}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs uppercase">{order.paymentMethod}</span>
                    <span className={`ml-2 text-xs ${order.paymentStatus === 'paid' ? 'text-maroon' : 'text-gold'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="border border-accent bg-cream px-2 py-1 text-xs outline-none focus:border-maroon"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal/50">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
