import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { dressCategories } from '../data/categories'
import SEO from '../components/ui/SEO'

export default function DressPage() {
  return (
    <main>
      <SEO title="Dresses & Kurta Sets" description="Discover our collection of premium dresses, kurta sets, and coord sets crafted for elegance." />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            title="Our Collections"
            subtitle="Dresses & Kurta Sets"
          />
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-charcoal/60">
            Discover premium dresses, kurta sets, and coord sets crafted for everyday elegance and special occasions.
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

        {/* SEO Keyword Density Paragraph */}
        <div className="mt-16 mx-auto max-w-5xl border-t border-accent/30 pt-10 text-center px-4">
          <h2 className="text-lg font-serif text-charcoal mb-3">Premium Dresses, Kurta Sets & Coord Sets</h2>
          <p className="text-[13px] text-charcoal/60 leading-relaxed font-light">
            Elevate your everyday wardrobe with our exclusive collection of premium dresses, traditional kurta sets, and modern coord sets. Crafted with the finest materials including breathable pure cotton and handloom weaves, our dresses offer the perfect blend of comfort and confidence. Whether you are looking for a casual day outfit or a sophisticated evening look, our boutique fashion selection is meticulously curated for modern women who appreciate quality and style. Shop our versatile collections today to experience luxury fashion tailored just for you.
          </p>
        </div>
      </section>
    </main>
  )
}
