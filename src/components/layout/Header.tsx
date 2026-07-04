import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { mainNav, navIcons, brand } from '../../data/navigation'
import { brandAssets } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import HeaderProfileLink from './HeaderProfileLink'
import HeaderCartButton from './HeaderCartButton'

function isNavActive(pathname: string, href?: string, label?: string): boolean {
  if (!href) return false
  if (label === 'COLLECTION') {
    return pathname.startsWith('/dress') || pathname === '/three-piece'
  }
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`)
}

function navDisplayLabel(label: string): string {
  return label
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const { wishlistCount, setSearchOpen } = useStore()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [location.pathname])

  const iconClass = 'text-charcoal/80 transition-colors hover:text-maroon'
  const navLinkClass = (active: boolean) =>
    `flex items-center gap-0.5 whitespace-nowrap text-[13px] transition-colors lg:text-sm ${
      active ? 'text-maroon' : 'text-charcoal/85 hover:text-maroon'
    }`

  const logo = (
    <Link to="/" className="flex shrink-0 flex-col items-center">
      <img
        src={brandAssets.logo}
        alt={brand.name}
        className="h-11 w-auto object-contain md:h-14"
      />
    </Link>
  )

  const navItems = mainNav.map((item) => {
    const Icon = item.icon ? navIcons[item.icon] : null
    const active = isNavActive(location.pathname, item.href, item.label)

    return (
      <div
        key={item.label}
        className="relative"
        onMouseEnter={() => item.children && setActiveDropdown(item.label)}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <Link to={item.href ?? '/'} className={navLinkClass(active)}>
          {Icon && <Icon size={14} strokeWidth={1.5} />}
          {navDisplayLabel(item.label)}
          {item.children && <ChevronDown size={12} className="mt-px" />}
        </Link>
        {item.children && activeDropdown === item.label && (
          <div className="glass-panel absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 py-3 shadow-lg">
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
  })

  const actions = (
    <div className="flex items-center gap-4 md:gap-5">
      <button
        onClick={() => setSearchOpen(true)}
        className={iconClass}
        aria-label="Search"
      >
        <Search size={20} strokeWidth={1.5} />
      </button>
      <HeaderProfileLink />
      <Link to="/wishlist" className={`relative ${iconClass}`} aria-label="Wishlist">
        <Heart size={20} strokeWidth={1.5} />
        {wishlistCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold leading-none text-cream">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </Link>
      <span className="hidden h-5 w-px bg-accent md:block" aria-hidden />
      <HeaderCartButton />
    </div>
  )

  return (
    <header className="site-header">
      <div className="mx-auto max-w-7xl px-4 pt-3 pb-2 md:px-8 md:pt-3 md:pb-2">
        <div className="relative flex items-center justify-between md:hidden">
          <button
            className="text-charcoal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">{logo}</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className={iconClass} aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <HeaderCartButton />
          </div>
        </div>

        <div className="hidden md:block">
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center">
            <div aria-hidden />
            <div className="justify-self-center">{logo}</div>
            <div className="justify-self-end">{actions}</div>
          </div>

          <nav className="mt-2 flex flex-nowrap items-center justify-center gap-x-4 lg:gap-x-6">
            {navItems}
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-accent bg-white px-4 py-4 md:hidden">
          {mainNav.map((item) => {
            const Icon = item.icon ? navIcons[item.icon] : null
            return (
              <div key={item.label}>
                <Link
                  to={item.href ?? '/'}
                  className="flex items-center gap-2 border-b border-accent/60 py-3 text-sm text-charcoal"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon size={14} strokeWidth={1.5} />}
                  {navDisplayLabel(item.label)}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block border-b border-accent/60 py-2.5 pl-4 text-sm text-charcoal/70"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )
          })}
          <div className="mt-3 flex gap-6 pt-2">
            <Link
              to="/wishlist"
              className="text-sm text-charcoal/70"
              onClick={() => setMobileOpen(false)}
            >
              Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/account"
              className="text-sm text-charcoal/70"
              onClick={() => setMobileOpen(false)}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
