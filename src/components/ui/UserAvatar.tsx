function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

interface UserAvatarProps {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-14 w-14 text-base',
}

export default function UserAvatar({
  name,
  avatarUrl,
  size = 'sm',
  className = '',
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size]

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${sizeClass} ${className}`}
      />
    )
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-maroon font-medium text-cream ${sizeClass} ${className}`}
      aria-hidden
    >
      {getInitial(name)}
    </span>
  )
}
