import { Link, useLocation } from 'react-router-dom'
import { LogOut, Package, RotateCcw, User } from 'lucide-react'

interface AccountSidebarProps {
  name: string
  email: string
  avatarUrl?: string
  onLogout: () => void
}

const links = [
  { to: '/account', label: 'Profile', icon: User, exact: true },
  { to: '/account/orders', label: 'My Orders', icon: Package, exact: false },
  { to: '/account/returns', label: 'My Returns', icon: RotateCcw, exact: false },
]

export default function AccountSidebar({ name, email, avatarUrl, onLogout }: AccountSidebarProps) {
  const { pathname } = useLocation()

  return (
    <aside className="border border-accent p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream-dark">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover"  loading="lazy" />
          ) : (
            <User size={24} className="text-maroon" />
          )}
        </div>
        <div>
          <p className="font-serif text-sm text-charcoal">{name}</p>
          <p className="text-xs text-charcoal/50">{email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-[0.1em] uppercase transition-colors ${
                active
                  ? 'bg-maroon/10 text-maroon'
                  : 'text-charcoal/70 hover:bg-cream-dark hover:text-charcoal'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 flex w-full items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-[0.1em] text-gold uppercase transition-colors hover:text-gold-light"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </aside>
  )
}
