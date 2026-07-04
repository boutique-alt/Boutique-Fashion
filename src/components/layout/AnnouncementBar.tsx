import { Link } from 'react-router-dom'
import { brand } from '../../data/navigation'

export default function AnnouncementBar() {
  return (
    <div className="bg-gold px-4 py-2 text-cream md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs">
        <span className="truncate">Need Help? Call {brand.phone}</span>
        <div className="flex shrink-0 items-center gap-4">
          <Link to="/account" className="transition-opacity hover:opacity-80">
            Login / Register
          </Link>
          <Link to="/account/orders" className="transition-opacity hover:opacity-80">
            Order Tracking
          </Link>
        </div>
      </div>
    </div>
  )
}
