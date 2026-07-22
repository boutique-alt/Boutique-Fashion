import { ShoppingCart } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

interface HeaderCartButtonProps {
  className?: string
}

export default function HeaderCartButton({ className = '' }: HeaderCartButtonProps) {
  const { cartCount, setCartOpen } = useStore()

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={`relative transition-colors ${className || 'text-charcoal/80 hover:text-maroon'}`}
      aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
    >
      <ShoppingCart size={20} strokeWidth={1.5} />
      <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold leading-none text-cream">
        {cartCount > 99 ? '99+' : cartCount}
      </span>
    </button>
  )
}
