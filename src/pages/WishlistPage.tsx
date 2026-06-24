import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import ProductCard from '../components/ui/ProductCard'
import { useStore } from '../context/StoreContext'
import { getProductsBySlugs } from '../data/productCatalog'
import { aboutAssets } from '../data/about'

export default function WishlistPage() {
  const { wishlist } = useStore()
  const products = getProductsBySlugs(wishlist)

  return (
    <main>
      <PageBanner
        title="Wishlist"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Wishlist' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Heart size={48} className="mx-auto text-charcoal/20" />
              <p className="mt-4 text-charcoal/60">Your wishlist is empty</p>
              <Link
                to="/dress"
                className="mt-6 inline-block bg-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
