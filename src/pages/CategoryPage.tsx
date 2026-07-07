import { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { getCategoryBySlug } from '../data/categories'
import { useProductCatalog } from '../hooks/useProductCatalog'
import { CategorySchema } from '../components/seo/CategorySchema'
import SEO from '../components/ui/SEO'

interface CategoryPageProps {
  slug?: string
}

export default function CategoryPage({ slug: slugProp }: CategoryPageProps) {
  const { category: categorySlug } = useParams<{ category: string }>()
  const slug = slugProp ?? categorySlug
  const config = slug ? getCategoryBySlug(slug) : undefined
  const { products: catalog } = useProductCatalog()
  const categoryProducts = catalog.filter((p) => p.categorySlug === slug)
  const { sorted, setSort } = useSortedProducts(categoryProducts)
  const [visibleCount, setVisibleCount] = useState(24)

  useEffect(() => {
    setVisibleCount(24)
  }, [slug])

  if (!config) {
    return <Navigate to="/dress" replace />
  }

  const description = `Shop our exclusive ${config?.title || 'collection'}. Discover premium boutique fashion, crafted with quality fabrics and elegant design.`

  return (
    <main>
      <SEO 
        title={config?.title || 'Collection'} 
        description={description} 
      />
      <CategorySchema category={config} />
      <div className="mx-auto max-w-7xl px-4 pt-10 text-center md:px-6">
        <h1 className="font-serif text-3xl font-medium text-charcoal md:text-4xl">
          {config.title || 'Collection'}
        </h1>
        {config.description && (
          <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
            {config.description}
          </p>
        )}
      </div>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <CategoryToolbar total={categoryProducts.length} onSortChange={setSort} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visibleCount < sorted.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 24)}
                className="rounded-sm border border-maroon px-8 py-3 text-sm font-medium tracking-wide text-maroon transition-colors hover:bg-maroon hover:text-white"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        {/* SEO Keyword Density Paragraph */}
        <div className="mt-16 mx-auto max-w-5xl border-t border-accent/30 pt-10 text-center px-4">
          <h2 className="text-lg font-serif text-charcoal mb-3">Shop Premium {config?.title || 'Boutique Fashion'}</h2>
          <p className="text-[13px] text-charcoal/60 leading-relaxed font-light">
            Discover the finest selection of {config?.title?.toLowerCase() || 'premium clothing'} at Boutique Fashion. We specialize in curating high-quality, elegant fashion pieces that offer unmatched comfort and style. From sophisticated daily wear to luxurious ceremonial outfits, our carefully designed collections are crafted with the best pure cotton, handloom, and silk fabrics available. Upgrade your wardrobe with our latest arrivals and experience the true essence of modern, sustainable boutique fashion today.
          </p>
        </div>
      </section>
    </main>
  )
}
