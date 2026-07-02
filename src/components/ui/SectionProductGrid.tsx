import ProductCard from './ProductCard'
import type { Product } from '../../data/products'

interface SectionProductGridProps {
  title: string
  products: Product[]
  limit?: number
  showVideo?: boolean
}

export default function SectionProductGrid({
  title,
  products,
  limit,
  showVideo,
}: SectionProductGridProps) {
  const items = limit ? products.slice(0, limit) : products

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} showVideo={showVideo} />
        ))}
      </div>
    </div>
  )
}
