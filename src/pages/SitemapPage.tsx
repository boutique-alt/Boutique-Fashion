import { Link } from 'react-router-dom'
import SEO from '../components/ui/SEO'
import { mainNav, footerCategories, footerSupport } from '../data/navigation'

export default function SitemapPage() {
  return (
    <main>
      <SEO 
        title="HTML Sitemap" 
        description="Sitemap for Boutique Fashion. Quickly navigate through our collections, products, and legal pages."
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h1 className="font-serif text-3xl font-medium text-charcoal md:text-4xl">
              Site Map
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
              Navigate through our entire boutique collection and pages.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Main Navigation */}
            <div>
              <h2 className="mb-6 font-serif text-2xl text-charcoal border-b border-accent/30 pb-3">
                Main Pages
              </h2>
              <ul className="space-y-3">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href || '#'} className="text-maroon hover:text-gold transition-colors">
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mt-2 ml-4 space-y-2 border-l border-accent/40 pl-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link to={child.href} className="text-sm text-charcoal/70 hover:text-gold transition-colors">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-12">
              {/* Categories */}
              <div>
                <h2 className="mb-6 font-serif text-2xl text-charcoal border-b border-accent/30 pb-3">
                  All Categories
                </h2>
                <ul className="space-y-3">
                  <li>
                    <Link to="/shop/all" className="text-maroon hover:text-gold transition-colors">
                      Shop All
                    </Link>
                  </li>
                  {footerCategories.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="text-charcoal/80 hover:text-gold transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Support */}
              <div>
                <h2 className="mb-6 font-serif text-2xl text-charcoal border-b border-accent/30 pb-3">
                  Support & Legal
                </h2>
                <ul className="space-y-3">
                  {footerSupport.map((item) => {
                    // Match the label to the route manually for the sitemap
                    let route = '/terms-and-conditions'
                    if (item === 'Privacy Policy') route = '/privacy-policy'
                    if (item === 'Refund Policy') route = '/returns'
                    if (item === 'Shipping & Return') route = '/contact-us'
                    
                    return (
                      <li key={item}>
                        <Link to={route} className="text-charcoal/80 hover:text-gold transition-colors">
                          {item}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Utility Pages */}
              <div>
                <h2 className="mb-6 font-serif text-2xl text-charcoal border-b border-accent/30 pb-3">
                  Account & Utilities
                </h2>
                <ul className="space-y-3">
                  <li><Link to="/account" className="text-charcoal/80 hover:text-gold transition-colors">My Account</Link></li>
                  <li><Link to="/cart" className="text-charcoal/80 hover:text-gold transition-colors">Cart</Link></li>
                  <li><Link to="/wishlist" className="text-charcoal/80 hover:text-gold transition-colors">Wishlist</Link></li>
                  <li><Link to="/checkout" className="text-charcoal/80 hover:text-gold transition-colors">Checkout</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
