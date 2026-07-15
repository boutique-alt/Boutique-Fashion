import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AdminOrderRow from '../../components/admin/AdminOrderRow'
import { loadOrdersPaginated } from '../../services/orderService'
import type { Order } from '../../types/order'

const PAGE_SIZE = 20

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    loadOrdersPaginated(page, PAGE_SIZE).then(({ orders: newOrders, total }) => {
      if (mounted) {
        setOrders(newOrders)
        setTotalOrders(total)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [page, version])

  const refresh = () => setVersion((v) => v + 1)
  
  const totalPages = Math.ceil(totalOrders / PAGE_SIZE)

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
          <p className="mt-1 text-sm text-charcoal/60">{totalOrders} total orders</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon/20 border-t-maroon" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 border border-dashed border-accent py-16 text-center">
          <p className="text-sm text-charcoal/50">No orders yet. Orders appear here after checkout.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto flex-1">
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
                <th className="px-4 py-3">Details</th>
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

      {/* Pagination Bottom */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-2 border border-accent bg-cream disabled:opacity-50 hover:bg-cream-dark transition-colors"
          >
            <ChevronLeft size={16} className="text-charcoal" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={loading}
              className={`min-w-[32px] h-8 px-2 flex items-center justify-center text-sm font-mono border ${
                p === page ? 'border-maroon bg-maroon text-cream' : 'border-accent bg-cream text-charcoal hover:bg-cream-dark'
              } transition-colors`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="p-2 border border-accent bg-cream disabled:opacity-50 hover:bg-cream-dark transition-colors"
          >
            <ChevronRight size={16} className="text-charcoal" />
          </button>
        </div>
      )}
    </div>
  )
}
