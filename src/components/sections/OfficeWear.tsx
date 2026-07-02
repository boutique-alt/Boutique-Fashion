import { Link } from 'react-router-dom'
import ProductCard from '../ui/ProductCard'
import { mensCollectionProducts } from '../../data/products'

export default function OfficeWear() {
  const displayedProducts = mensCollectionProducts.slice(0, 4)

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
            Men&apos;s Collection
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/60">
            Discover ethnic wear, contemporary outfits, and tailored sets designed for weddings,
            celebrations, and everyday sophistication.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/dress/mens"
            className="inline-block border border-charcoal px-10 py-3 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all hover:bg-charcoal hover:text-cream md:text-xs"
          >
            Show More
          </Link>
        </div>
      </div>
    </section>
  )
}
