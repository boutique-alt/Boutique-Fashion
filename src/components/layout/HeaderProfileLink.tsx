import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import UserAvatar from '../ui/UserAvatar'

interface HeaderProfileLinkProps {
  className?: string
}

function displayName(name: string): string {
  const first = name.trim().split(/\s+/)[0]
  return first || name
}

export default function HeaderProfileLink({ className = '' }: HeaderProfileLinkProps) {
  const { user } = useStore()
  const { avatarUrl } = useUserProfile()
  const label = user ? displayName(user.name) : 'Sign In'

  return (
    <Link
      to="/account"
      className={`flex items-center gap-2 transition-colors ${className || 'text-charcoal/80 hover:text-maroon'}`}
      aria-label={user ? `Account, ${user.name}` : 'Sign in'}
    >
      {user ? (
        <UserAvatar name={user.name} avatarUrl={avatarUrl} size="sm" />
      ) : (
        <User size={20} strokeWidth={1.5} className="shrink-0" />
      )}
      <span className="hidden max-w-[6.5rem] truncate text-sm md:inline">{label}</span>
    </Link>
  )
}
