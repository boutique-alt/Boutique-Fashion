import { Link, Navigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { getShopPageProducts, getShopResultRange, getShopTotalPages } from '../data/shop'
import { useProductCatalog } from '../hooks/useProductCatalog'
import SEO from '../components/ui/SEO'

export default function ShopAllPage() {
  const { page } = useParams<{ page?: string }>()
  const currentPage = page ? parseInt(page, 10) : 1
  const { version } = useProductCatalog()
  const totalPages = getShopTotalPages()

  const products = getShopPageProducts(currentPage)
  const range = getShopResultRange(currentPage)
  const { sorted, setSort } = useSortedProducts(products)

  if (version === 0 && totalPages === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center pt-[var(--site-header-height)]">
        <p className="animate-pulse text-sm text-charcoal/40">Loading products...</p>
      </main>
    )
  }

  if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
    return <Navigate to="/shop/all" replace />
  }

  return (
    <main>
      <SEO title="Shop All" description="Browse our complete collection of premium boutique clothing." />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="mb-6 font-serif text-3xl font-medium text-charcoal md:text-4xl">Shop All</h1>
          <div className="mb-4 text-sm text-charcoal/60">
            Showing {range.from}–{range.to} of {range.total} results
          </div>
          <CategoryToolbar total={range.total} onSortChange={setSort} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {getShopTotalPages() > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: getShopTotalPages() }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  to={p === 1 ? '/shop/all' : `/shop/all/page/${p}`}
                  className={`flex h-10 w-10 items-center justify-center text-sm transition-colors ${
                    p === currentPage
                      ? 'bg-maroon text-cream'
                      : 'border border-accent text-charcoal/70 hover:border-maroon hover:text-maroon'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* SEO Keyword Density Paragraph */}
        <div className="mt-16 mx-auto max-w-5xl border-t border-accent/30 pt-10 text-center px-4">
          <h2 className="text-lg font-serif text-charcoal mb-3">Premium Boutique Fashion Collection</h2>
          <p className="text-[13px] text-charcoal/60 leading-relaxed font-light">
            Explore our meticulously curated selection of premium boutique fashion at Boutique Fashion. We offer an exclusive range of clothing including elegant dresses, beautiful kurta sets, and sophisticated coord sets. Crafted with luxurious fabrics like pure cotton, Chanderi, and Katan silk, our online boutique guarantees high-quality, comfortable, and sustainable fashion for every occasion. Shop the latest arrivals in women's clothing and elevate your wardrobe with our signature handblock prints and delicate embroidery.
          </p>
        </div>
      </section>
    </main>
  )
}
