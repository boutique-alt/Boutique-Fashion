import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { searchProducts } from '../../data/productCatalog'
import { useProductCatalog } from '../../hooks/useProductCatalog'
import { productPath } from '../../utils/productSlug'

export default function SearchDrawer() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useProductCatalog()
  const results = searchProducts(query)

  useEffect(() => {
    if (searchOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [searchOpen])

  if (!searchOpen) return null

  const close = () => setSearchOpen(false)

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={close} />
      <div className="absolute inset-x-0 top-0 bg-cream shadow-xl">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
          <div className="flex items-center gap-3 border-b border-accent pb-4">
            <Search size={20} className="shrink-0 text-charcoal/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses, fabrics, bridal & more"
              className="flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-charcoal/40"
            />
            <button onClick={close} className="text-charcoal/60 transition-colors hover:text-maroon" aria-label="Close search">
              <X size={22} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-4">
            {query.trim() === '' ? (
              <p className="py-8 text-center text-sm text-charcoal/50">Type to search our collection</p>
            ) : results.length === 0 ? (
              <p className="py-8 text-center text-sm text-charcoal/50">No products found for &ldquo;{query}&rdquo;</p>
            ) : (
              <ul className="space-y-3">
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link
                      to={productPath(product.slug)}
                      onClick={close}
                      className="flex items-center gap-4 rounded-sm p-2 transition-colors hover:bg-cream-dark"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-12 shrink-0 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-charcoal">{product.name}</p>
                        <p className="text-xs text-charcoal/50">{product.categoryLabel}</p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-charcoal">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
