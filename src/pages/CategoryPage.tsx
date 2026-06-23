import { Navigate, useParams } from 'react-router-dom'
import PageBanner from '../components/layout/PageBanner'
import ProductCard from '../components/ui/ProductCard'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { getCategoryBySlug } from '../data/categories'
import { aboutAssets } from '../data/about'

interface CategoryPageProps {
  slug?: string
}

export default function CategoryPage({ slug: slugProp }: CategoryPageProps) {
  const { category } = useParams<{ category: string }>()
  const slug = slugProp ?? category
  const config = slug ? getCategoryBySlug(slug) : undefined
  const { sorted, setSort } = useSortedProducts(config?.products ?? [])

  if (!config) {
    return <Navigate to="/shop" replace />
  }

  return (
    <main>
      <PageBanner
        title={config.title}
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: config.parent.label, href: config.parent.href },
          { label: config.title },
        ]}
      />
      {config.description && (
        <p className="mx-auto max-w-2xl px-4 pt-10 text-center text-sm leading-relaxed text-charcoal/60 md:px-6">
          {config.description}
        </p>
      )}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <CategoryToolbar total={config.count} onSortChange={setSort} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
