import { Navigate } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import AnimatedGrid from '../components/ui/AnimatedGrid'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { getShopCategoryById } from '../data/shopCategories'
import { useProductCatalog } from '../hooks/useProductCatalog'

interface ShopCategoryLandingPageProps {
  categoryId: string
}

export default function ShopCategoryLandingPage({ categoryId }: ShopCategoryLandingPageProps) {
  const config = getShopCategoryById(categoryId)
  const { products: catalog } = useProductCatalog()
  const categoryProducts = config ? catalog.filter(config.matchProduct) : []
  const { sorted, setSort } = useSortedProducts(categoryProducts)

  if (!config) {
    return <Navigate to="/" replace />
  }

  return (
    <main>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <CategoryToolbar total={categoryProducts.length} onSortChange={setSort} />
          <AnimatedGrid className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatedGrid>
        </div>
      </section>
    </main>
  )
}
