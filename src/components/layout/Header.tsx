import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { mainNav, brand } from '../../data/navigation'
import { brandAssets } from '../../data/products'
import { useStore } from '../../context/StoreContext'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const { cartCount, wishlistCount, setSearchOpen, setCartOpen } = useStore()

  const isActive = (href?: string) => href === location.pathname

  return (
    <header className="sticky top-0 z-50 border-b border-accent bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <button
          className="text-charcoal md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex flex-col items-center">
          <img
            src={brandAssets.logo}
            alt={brand.name}
            className="h-10 w-auto object-contain md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href ?? '/'}
                className={`flex items-center gap-1 font-sans text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                  isActive(item.href) ? 'text-maroon' : 'text-charcoal/80 hover:text-maroon'
                }`}
              >
                {item.label}
                {item.children && <ChevronDown size={12} />}
              </Link>
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full z-50 min-w-[180px] border border-accent bg-cream py-3 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-5 py-2 text-xs tracking-wide text-charcoal/70 transition-colors hover:bg-cream-dark hover:text-maroon"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="text-charcoal/70 transition-colors hover:text-maroon"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link
            to="/wishlist"
            className="relative hidden text-charcoal/70 transition-colors hover:text-maroon sm:block"
            aria-label="Wishlist"
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-cream">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className="hidden text-charcoal/70 transition-colors hover:text-maroon sm:block"
            aria-label="Account"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-charcoal/70 transition-colors hover:text-maroon"
            aria-label="Cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-cream">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-accent bg-cream px-4 py-4 md:hidden">
          {mainNav.map((item) => (
            <div key={item.label}>
              <Link
                to={item.href ?? '/'}
                className="block border-b border-accent py-3 text-xs font-medium tracking-[0.15em] text-charcoal uppercase"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.label}
                  to={child.href}
                  className="block border-b border-accent py-2.5 pl-4 text-xs text-charcoal/70"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-3 flex gap-6 pt-2">
            <Link to="/wishlist" className="text-xs tracking-wide text-charcoal/70 uppercase" onClick={() => setMobileOpen(false)}>
              Wishlist ({wishlistCount})
            </Link>
            <Link to="/account" className="text-xs tracking-wide text-charcoal/70 uppercase" onClick={() => setMobileOpen(false)}>
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
