import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import { dressCategories } from '../data/categories'
import { aboutAssets } from '../data/about'

export default function DressPage() {
  return (
    <main>
      <PageBanner
        title="Dress"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dress' },
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            title="Our Dress Collections"
            subtitle="One Piece & Two Piece"
          />
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-charcoal/60">
            Discover premium women&apos;s dresses including handblock cotton midi dresses,
            kaftaan styles, and elegant coord sets crafted for everyday elegance and special occasions.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {dressCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/dress/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={cat.products[0]?.image}
                  alt={cat.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-xs tracking-[0.2em] text-gold uppercase">{cat.count} Products</p>
                  <h2 className="mt-1 font-serif text-3xl text-cream">{cat.title}</h2>
                  <p className="mt-2 max-w-sm text-sm text-cream/70">{cat.description}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs tracking-widest text-cream uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    Shop Now <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
