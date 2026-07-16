import { Search } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

interface HeaderSearchBarProps {
  className?: string
}

export default function HeaderSearchBar({ className = '' }: HeaderSearchBarProps) {
  const { setSearchOpen } = useStore()

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      className={`flex w-full items-center gap-3 rounded-md border border-maroon/25 bg-accent px-4 py-2.5 text-left transition-colors hover:border-maroon/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 ${className}`}
      aria-label="Search products"
    >
      <Search size={18} className="shrink-0 text-charcoal/40" strokeWidth={1.75} />
      <span className="truncate text-sm text-charcoal/45">
        Search dresses, fabrics, bridal &amp; more
      </span>
    </button>
  )
}
