import ProductCard from '../ui/ProductCard'
import { mensCollectionProducts } from '../../data/products'

export default function OfficeWear() {
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
          {mensCollectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
