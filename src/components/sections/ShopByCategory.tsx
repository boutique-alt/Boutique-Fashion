import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { countShopCategoryProducts } from '../../services/shopCategoryService'
import { useProductCatalog } from '../../hooks/useProductCatalog'
import { useShopCategories } from '../../hooks/useShopCategories'

export default function ShopByCategory() {
  const { categories } = useShopCategories()
  const { products } = useProductCatalog()

  if (categories.length === 0) return null

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-8 text-center font-serif text-2xl font-medium tracking-wide text-charcoal md:mb-10 md:text-3xl lg:text-4xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="group relative overflow-hidden bg-[#f4f4f4]"
            >
              <div className="aspect-[3/4] w-full">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent px-3 pb-4 pt-10">
                <h3 className="flex items-center gap-1 font-serif text-sm text-cream md:text-base">
                  {cat.label}
                  <span className="text-xs text-cream/70">
                    ({countShopCategoryProducts(cat, products)})
                  </span>
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
