import { Link } from 'react-router-dom'

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
        <div className="flex justify-center gap-4 md:gap-8 max-w-5xl mx-auto w-full">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="group flex flex-1 flex-col items-center min-w-0 max-w-[250px]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#f8f4f4] p-2 md:p-4 transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-full object-cover object-top"
                />
              </div>
              <h3 className="mt-4 text-center font-sans text-[12px] font-semibold uppercase tracking-wider text-charcoal md:text-[13px]">
                {cat.label}
              </h3>
              <p className="mt-1 text-[10px] text-charcoal/50 uppercase tracking-widest">
                {countShopCategoryProducts(cat, products)} Items
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
