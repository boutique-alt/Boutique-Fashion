import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import SectionProductGrid from '../ui/SectionProductGrid'
import { useProductCatalog } from '../../hooks/useProductCatalog'

export default function SummerSale() {
  const { products } = useProductCatalog()

  const bestSellers = useMemo(
    () => products.filter((p) => p.isBestSeller),
    [products],
  )

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionProductGrid title="Best Selling Products" products={bestSellers} limit={4} />
        <div className="mt-10 text-center">
          <Link
            to="/shop/all"
            className="inline-block border border-charcoal px-10 py-3 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all hover:bg-charcoal hover:text-cream md:text-xs"
          >
            Show More
          </Link>
        </div>
      </div>
    </section>
  )
}
