import { Heart } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

interface WishlistButtonProps {
  slug: string
  className?: string
}

export default function WishlistButton({ slug, className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useStore()
  const active = isInWishlist(slug)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(slug)
      }}
      className={`transition-colors ${active ? 'text-gold' : 'text-charcoal/50 hover:text-gold'} ${className}`}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} strokeWidth={1.5} />
    </button>
  )
}
