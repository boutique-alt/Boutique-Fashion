import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import type { Order } from '../../types/order'
import AccountOrderCard from './AccountOrderCard'

interface AccountRecentOrdersProps {
  orders: Order[]
  email: string
}

export default function AccountRecentOrders({ orders, email }: AccountRecentOrdersProps) {
  const recent = orders.slice(0, 3)

  return (
    <div className="mt-8 border-t border-accent pt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-serif text-lg text-charcoal">Recent Orders</h3>
        {orders.length > 0 && (
          <Link
            to="/account/orders"
            className="text-[10px] font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
          >
            View all
          </Link>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center">
          <Package size={32} className="mx-auto text-charcoal/20" />
          <p className="mt-3 text-sm text-charcoal/50">No orders yet.</p>
          <Link
            to="/dress"
            className="mt-3 inline-block text-[10px] font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recent.map((order) => (
            <AccountOrderCard key={order.id} order={order} email={email} />
          ))}
        </div>
      )}

      <p className="mt-4 text-[10px] text-charcoal/40">
        7-day easy returns on eligible orders.{' '}
        <Link to="/contact-us" className="text-maroon hover:text-maroon-light">
          Read policy
        </Link>
      </p>
    </div>
  )
}
