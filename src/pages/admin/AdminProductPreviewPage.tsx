import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import ProductGallery from '../../components/product/ProductGallery'
import ProductPurchase from '../../components/product/ProductPurchase'
import AdminProductCard from '../../components/admin/AdminProductCard'
import { getProductBySlug, getRelatedProducts } from '../../data/productCatalog'
import { useProductCatalog } from '../../hooks/useProductCatalog'
import { productPath } from '../../utils/productSlug'
import { fetchProductDetails } from '../../services/productService'

export default function AdminProductPreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  useProductCatalog()
  const product = slug ? getProductBySlug(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
    if (slug) {
      void fetchProductDetails(slug)
    }
  }, [slug])

  if (!product) {
    return <Navigate to="/admin/products" replace />
  }

  const related = getRelatedProducts(product)

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-charcoal/70 uppercase transition-colors hover:text-maroon"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
        <a
          href={productPath(product.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-maroon uppercase transition-colors hover:text-maroon-light"
        >
          View on store
          <ExternalLink size={14} />
        </a>
      </div>

      <p className="mb-2 text-[10px] font-medium tracking-[0.15em] text-charcoal/40 uppercase">
        Customer preview
      </p>
      <h1 className="mb-8 font-serif text-2xl text-charcoal">{product.name}</h1>

      <div className="rounded border border-accent bg-cream p-4 md:p-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductPurchase product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10 border-t border-accent pt-10">
          <h2 className="mb-6 font-serif text-xl text-charcoal">Related Products</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <AdminProductCard key={p.id} product={p} previewOnly />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
