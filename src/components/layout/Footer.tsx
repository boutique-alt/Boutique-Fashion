import { Link } from 'react-router-dom'
import { brand, footerSupport, footerQuickLinks } from '../../data/navigation'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  )
}


function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.656-.372-1.306-.543-2.149-1.87-2.214-1.956-.065-.086-.533-.709-.533-1.354 0-.645.337-.962.457-1.087.12-.125.26-.156.347-.156.087 0 .173.001.248.005.078.004.184-.03.288.22.108.26.37 1.026.402 1.096.033.07.054.152.008.243-.046.091-.069.148-.137.228-.068.08-.143.178-.204.239-.069.068-.14.142-.06.279.079.137.352.58.756.94.52.463.959.606 1.096.674.137.069.217.06.297-.033.08-.092.343-.399.435-.536.092-.137.183-.114.309-.068.125.046.793.374.93.443.137.069.228.103.262.16.034.058.034.336-.11.741zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.447 5.174L2 22l4.98-1.307A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.98-.12-2.48.02-3.55l.89-3.77s-.23-.45-.23-1.12c0-1.05.61-1.84 1.37-1.84.64 0 .96.48.96 1.06 0 .65-.41 1.62-.63 2.51-.18.75.38 1.36 1.12 1.36 1.34 0 2.38-1.42 2.38-3.46 0-1.81-1.3-3.08-3.16-3.08-2.31 0-3.67 1.73-3.67 3.52 0 .7.27 1.45.6 1.86.07.08.08.15.06.23l-.22.92c-.04.14-.12.17-.28.1-1.04-.48-1.69-2-1.69-3.22 0-2.62 1.9-5.02 5.48-5.02 2.88 0 5.12 2.05 5.12 4.79 0 2.86-1.8 5.16-4.3 5.16-.84 0-1.63-.44-1.9-.95l-.52 1.97c-.19.72-.7 1.62-1.04 2.18A12 12 0 1 0 12 0z"/>
    </svg>
  )
}

const quickLinkRoutes: Record<string, string> = {
  'My Account': '/account',
  Cart: '/cart',
  Wishlist: '/wishlist',
  Checkout: '/checkout',
  Sitemap: '/sitemap',
}

export default function Footer() {
  return (
    <footer className="bg-gold text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">CUSTOMER SUPPORT</h3>
            <ul className="space-y-2.5">
              {footerSupport.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-cream/60 transition-colors hover:text-charcoal">
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
                  <Link to={quickLinkRoutes[item] ?? '#'} className="text-sm text-cream/60 transition-colors hover:text-charcoal">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 font-serif text-lg tracking-widest">CONTACT US</h3>
            <p className="mb-2 text-sm text-cream/60">
              <Link to="/contact-us" className="transition-colors hover:text-charcoal">Find our location. Visit Our Store</Link>
            </p>
            <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="block text-sm text-cream transition-colors hover:text-charcoal">
              {brand.phone}
            </a>
            <a href={`mailto:${brand.email}`} className="mt-2 block text-sm text-cream/60 transition-colors hover:text-charcoal">
              {brand.email}
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <a href="https://www.instagram.com/theboutiquesarees/" target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#E1306C]" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/theboutiquesarees/" target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#1877F2]" aria-label="Facebook Page">
                <FacebookIcon />
              </a>
              <a href={`https://wa.me/918334816333?text=${encodeURIComponent('Hi, I am visiting Boutique Fashion website and would like some assistance.')}`} target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#25D366]" aria-label="Chat on WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#1877F2]" aria-label="Share on Facebook">
                <FacebookIcon />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out Boutique Fashion!')}`} target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#1DA1F2]" aria-label="Share on Twitter">
                <TwitterIcon />
              </a>
              <a href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent('https://www.boutiquefashion.shop/images/about/team-hero.webp')}&description=${encodeURIComponent('Boutique Fashion Kolkata')}`} target="_blank" rel="noopener noreferrer" className="text-cream/50 transition-colors hover:text-[#E60023]" aria-label="Share on Pinterest">
                <PinterestIcon />
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
          <p className="mt-2 text-xs tracking-wide text-cream/40">
            design and develop by <a href="https://www.pixelsolution.in/" target="_blank" rel="noopener noreferrer" className="hover:text-charcoal underline">pixel solution</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
