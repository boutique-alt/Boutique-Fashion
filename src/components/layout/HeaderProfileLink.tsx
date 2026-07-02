import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

interface HeaderProfileLinkProps {
  className?: string
}

function displayName(name: string): string {
  const first = name.trim().split(/\s+/)[0]
  return first || name
}

export default function HeaderProfileLink({ className = '' }: HeaderProfileLinkProps) {
  const { user } = useStore()
  const label = user ? displayName(user.name) : 'Sign In'

  return (
    <Link
      to="/account"
      className={`flex items-center gap-2 text-charcoal/80 transition-colors hover:text-maroon ${className}`}
      aria-label={user ? `Account, ${user.name}` : 'Sign in'}
    >
      <User size={20} strokeWidth={1.5} className="shrink-0" />
      <span className="hidden max-w-[6.5rem] truncate text-sm md:inline">{label}</span>
    </Link>
  )
}
