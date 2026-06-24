import { Sparkles } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import ProductCard from '../components/ui/ProductCard'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { getAllProductDetails } from '../data/productCatalog'
import { aboutAssets } from '../data/about'

const bridalSlugs = new Set(['blouse', 'three-piece'])

export default function BridalPage() {
  const bridalProducts = getAllProductDetails().filter((p) => bridalSlugs.has(p.categorySlug))
  const { sorted, setSort } = useSortedProducts(bridalProducts)

  return (
    <main>
      <PageBanner
        title="Bridal"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Bridal' },
        ]}
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Sparkles size={32} className="mx-auto text-gold" strokeWidth={1.5} />
            <h2 className="mt-4 font-serif text-3xl font-medium text-charcoal md:text-4xl">
              Bridal & Occasion Wear
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60 md:text-base">
              Designer blouses and elegant suit sets crafted for weddings, celebrations,
              and moments that deserve something extraordinary.
            </p>
          </div>

          <CategoryToolbar total={bridalProducts.length} onSortChange={setSort} />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
