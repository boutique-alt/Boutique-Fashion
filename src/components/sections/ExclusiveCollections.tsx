import ProductCard from '../ui/ProductCard'
import { exclusiveCollectionProducts } from '../../data/products'
import { Link } from 'react-router-dom'

export default function ExclusiveCollections() {
  return (
    <section className="bg-[#fafafa] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-[10px] font-medium tracking-[0.35em] text-charcoal/50 uppercase md:text-xs">
            Collections
          </p>
          <h2 className="font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
            Exclusive Collections
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {exclusiveCollectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block border border-maroon px-10 py-3 text-[10px] font-medium tracking-[0.25em] text-maroon uppercase transition-all hover:bg-maroon hover:text-cream md:text-xs"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
