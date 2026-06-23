import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import { shopLandingCategories } from '../data/categories'
import { aboutAssets } from '../data/about'

export default function ShopPage() {
  return (
    <main>
      <PageBanner
        title="Shop"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop' },
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading title="Browse Collections" subtitle="All Categories" />
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-charcoal/60">
            Discover premium women&apos;s and men&apos;s fashion including summer kurtis, designer dresses,
            sarees, blouses, and tailored menswear crafted for everyday elegance and special occasions.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shopLandingCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={cat.products[0]?.image}
                  alt={cat.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-[0.2em] text-gold uppercase">{cat.count} Products</p>
                  <h2 className="mt-1 font-serif text-2xl text-cream">{cat.title}</h2>
                  <span className="mt-3 flex items-center gap-1 text-xs tracking-widest text-cream uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    Shop Now <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/shop/all"
              className="inline-block border border-charcoal px-10 py-3 text-xs font-medium tracking-[0.2em] text-charcoal uppercase transition-all hover:bg-charcoal hover:text-cream"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
