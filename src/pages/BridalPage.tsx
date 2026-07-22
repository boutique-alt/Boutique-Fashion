import { Sparkles } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import SEO from '../components/ui/SEO'
import { useProductCatalog } from '../hooks/useProductCatalog'
import { brand } from '../data/navigation'

const bridalSlugs = new Set(['blouse', 'three-piece', 'bridal'])

export default function BridalPage() {
  const { products: catalog } = useProductCatalog()
  const bridalProducts = catalog.filter((p) => bridalSlugs.has(p.categorySlug))
  const { sorted, setSort } = useSortedProducts(bridalProducts)

  const bridalPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Bridal Collection | ${brand.name}`,
    "description": "Discover our exquisite bridal collection for the perfect wedding dress.",
    "url": "https://boutiquefashion.shop/bridal",
    "isPartOf": {
      "@type": "WebSite",
      "name": brand.name,
      "url": "https://boutiquefashion.shop"
    },
    ...(bridalProducts.length > 0 ? {
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": bridalProducts.length,
        "itemListElement": bridalProducts.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://boutiquefashion.shop/product/${product.slug}`,
          "name": product.name,
          "image": product.image.startsWith('http') ? product.image : `https://boutiquefashion.shop${product.image}`
        }))
      }
    } : {})
  }

  return (
    <main>
      <SEO 
        title="Bridal Collection" 
        description="Discover our exquisite bridal collection for the perfect wedding dress." 
        schema={bridalPageSchema}
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Sparkles size={32} className="mx-auto text-gold" strokeWidth={1.5} />
            <h2 className="mt-4 font-serif text-3xl font-medium text-charcoal md:text-4xl">
              Bridal & Occasion Wear
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60 md:text-base">
              Designer blouses and elegant suit sets crafted for weddings, celebrations,
              and moments that deserve something extraordinary.
            </p>
          </div>

          <CategoryToolbar total={bridalProducts.length} onSortChange={setSort} />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* SEO Keyword Density Paragraph */}
        <div className="mt-16 mx-auto max-w-5xl border-t border-accent/30 pt-10 text-center px-4">
          <h2 className="text-lg font-serif text-charcoal mb-3">Exclusive Bridal Wear & Designer Blouses</h2>
          <p className="text-[13px] text-charcoal/60 leading-relaxed font-light">
            Welcome to the ultimate destination for elegant bridal wear and ceremonial fashion. Our exclusive bridal collection features exquisite designer blouses, premium three-piece suit sets, and luxurious wedding outfits crafted for your special moments. Each piece is designed with delicate Khadi embroidery, intricate handwork, and luxurious fabrics to ensure you look absolutely stunning. Whether you are a bride-to-be or attending a grand celebration, our bespoke bridal boutique offers the finest ceremonial fashion that blends traditional heritage with contemporary elegance.
          </p>
        </div>
      </section>
    </main>
  )
}
