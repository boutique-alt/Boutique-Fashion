import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductGallery from '../components/product/ProductGallery'
import ProductPurchase from '../components/product/ProductPurchase'

import ProductCard from '../components/ui/ProductCard'
import { getProductBySlug, getRelatedProducts, getAdjacentProducts } from '../data/productCatalog'
import { useProductCatalog } from '../hooks/useProductCatalog'
import { productPath } from '../utils/productSlug'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  useProductCatalog()
  const product = slug ? getProductBySlug(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) {
    return <Navigate to="/dress" replace />
  }

  const related = getRelatedProducts(product)
  const { prev, next } = getAdjacentProducts(slug!)

  return (
    <main key={slug}>
      {(prev || next) && (
        <div className="border-b border-accent bg-cream-dark/40">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs md:px-6">
            {prev ? (
              <Link to={productPath(prev.slug)} className="flex items-center gap-1 text-charcoal/60 transition-colors hover:text-maroon">
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">{prev.name}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={productPath(next.slug)} className="flex items-center gap-1 text-charcoal/60 transition-colors hover:text-maroon">
                <span className="hidden sm:inline">{next.name}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={14} />
              </Link>
            ) : <span />}
          </div>
        </div>
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="sticky top-24">
              <ProductGallery images={product.images} name={product.name} />
            </div>
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-accent bg-cream-dark/30 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="mb-10 text-center font-serif text-2xl font-medium text-charcoal md:text-3xl">
              Related Products
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
