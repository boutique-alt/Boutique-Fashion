import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { mainNav, navIcons, brand } from '../../data/navigation'
import { brandAssets } from '../../data/products'
import { useStore } from '../../context/StoreContext'

const SCROLL_THRESHOLD = 80

function isNavActive(pathname: string, href?: string, label?: string): boolean {
  if (!href) return false
  if (label === 'COLLECTION') {
    return pathname.startsWith('/dress') || pathname === '/three-piece'
  }
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`)
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { cartCount, wishlistCount, setSearchOpen, setCartOpen } = useStore()

  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled && !mobileOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD)
  }, [location.pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const headerClass = isTransparent
    ? 'site-header site-header-top'
    : 'site-header site-header-scrolled'

  const iconClass = 'text-charcoal/70 transition-colors hover:text-maroon'
  const navLinkClass = (active: boolean) =>
    `flex items-center gap-1 font-sans text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
      active ? 'text-maroon' : 'text-charcoal/80 hover:text-maroon'
    }`

  return (
    <header className={headerClass}>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 ${
          scrolled && isHome ? 'py-2.5' : 'py-3'
        } transition-[padding] duration-300`}
      >
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
            className={`w-auto object-contain transition-[height] duration-300 ${
              scrolled && isHome ? 'h-9 md:h-10' : 'h-10 md:h-12'
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-6 md:flex">
          {mainNav.map((item) => {
            const Icon = item.icon ? navIcons[item.icon] : null
            const active = isNavActive(location.pathname, item.href, item.label)

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href ?? '/'}
                  className={navLinkClass(active)}
                >
                  {Icon && <Icon size={14} strokeWidth={1.5} />}
                  {item.label}
                  {item.children && <ChevronDown size={12} />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="glass-panel absolute left-0 top-full z-50 min-w-[200px] py-3 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-5 py-2 text-xs tracking-wide text-charcoal/70 transition-colors hover:bg-white/50 hover:text-maroon"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className={iconClass}
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link
            to="/wishlist"
            className={`relative hidden sm:block ${iconClass}`}
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
            className={`hidden sm:block ${iconClass}`}
            aria-label="Account"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className={`relative ${iconClass}`}
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
        <div className="site-header-scrolled border-t border-accent px-4 py-4 md:hidden">
          {mainNav.map((item) => {
            const Icon = item.icon ? navIcons[item.icon] : null
            return (
              <div key={item.label}>
                <Link
                  to={item.href ?? '/'}
                  className="flex items-center gap-2 border-b border-accent/60 py-3 text-xs font-medium tracking-[0.15em] text-charcoal uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon size={14} strokeWidth={1.5} />}
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block border-b border-accent/60 py-2.5 pl-4 text-xs text-charcoal/70"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )
          })}
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
