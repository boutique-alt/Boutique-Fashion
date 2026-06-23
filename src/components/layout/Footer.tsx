import { Link } from 'react-router-dom'
import { brand, footerSupport, footerQuickLinks, footerCategories } from '../../data/navigation'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

const quickLinkRoutes: Record<string, string> = {
  'My Account': '/account',
  Cart: '/cart',
  Wishlist: '/wishlist',
  Checkout: '/checkout',
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">CUSTOMER SUPPORT</h3>
            <ul className="space-y-2.5">
              {footerSupport.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-cream/60 transition-colors hover:text-gold">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">QUICK LINKS</h3>
            <ul className="space-y-2.5">
              {footerQuickLinks.map((item) => (
                <li key={item}>
                  <Link to={quickLinkRoutes[item] ?? '#'} className="text-sm text-cream/60 transition-colors hover:text-gold">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-5 mt-8 font-serif text-lg tracking-widest">CATEGORIES</h3>
            <ul className="space-y-2.5">
              {footerCategories.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-cream/60 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">CONTACT US</h3>
            <p className="mb-2 text-sm text-cream/60">
              <Link to="/contact-us" className="transition-colors hover:text-gold">Find our location. Visit Our Store</Link>
            </p>
            <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="block text-sm text-gold transition-colors hover:text-gold-light">
              {brand.phone}
            </a>
            <a href={`mailto:${brand.email}`} className="mt-2 block text-sm text-cream/60 transition-colors hover:text-gold">
              {brand.email}
            </a>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-cream/50 transition-colors hover:text-gold" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">OUR BOUTIQUE</h3>
            <p className="text-sm leading-relaxed text-cream/60">
              <strong className="text-cream/80">Address:</strong> {brand.address}
            </p>
            <p className="mt-4 text-sm text-cream/60">
              <strong className="text-cream/80">Hours:</strong> {brand.hours}
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-cream/10 pt-8 text-center">
          <p className="text-xs tracking-wide text-cream/40">
            Copyright 2026 © {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
