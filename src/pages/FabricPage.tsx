import { Link } from 'react-router-dom'
import PageBanner from '../components/layout/PageBanner'
import FabricTypeCard from '../components/fabric/FabricTypeCard'
import ProductCard from '../components/ui/ProductCard'
import AnimatedGrid from '../components/ui/AnimatedGrid'
import FaqAccordion from '../components/ui/FaqAccordion'
import CategoryToolbar, { useSortedProducts } from '../components/shop/CategoryToolbar'
import { useProductCatalog } from '../hooks/useProductCatalog'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'
import { fabricFaqs, buildFabricFaqSchema } from '../data/fabricFaq'
import { fabricTypes, fabricHighlights } from '../data/fabricTypes'

export default function FabricPage() {
  const { products: catalog } = useProductCatalog()
  const fabricProducts = catalog.filter((p) => p.categorySlug === 'fabric')
  const { sorted, setSort } = useSortedProducts(fabricProducts)

  const fabricPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Our Fabrics | ${brand.name}`,
    "description": "Explore the premium, sustainable fabrics used in Boutique Fashion collections.",
    "url": "https://boutiquefashion.shop/fabric",
    "isPartOf": {
      "@type": "WebSite",
      "name": brand.name,
      "url": "https://boutiquefashion.shop"
    },
    ...(fabricProducts.length > 0 ? {
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": fabricProducts.length,
        "itemListElement": fabricProducts.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://boutiquefashion.shop/product/${product.slug}`,
          "name": product.name,
          "image": product.image.startsWith('http') ? product.image : `https://boutiquefashion.shop${product.image}`
        }))
      }
    } : {})
  }

  const fabricFaqSchema = buildFabricFaqSchema()

  return (
    <main>
      <SEO
        title="Our Fabrics"
        description="Explore the premium, sustainable fabrics used in Boutique Fashion collections."
        schema={[fabricPageSchema, fabricFaqSchema]}
      />
      <PageBanner
        title="Our Fabrics"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Fabric' },
        ]}
      />

      {fabricProducts.length > 0 && (
        <section className="bg-cream py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-maroon">Shop Fabric</p>
              <h2 className="mt-3 font-serif text-2xl font-medium text-charcoal md:text-3xl">
                Premium Fabrics Online
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/65 md:text-base">
                Browse our curated fabric collection — pure cotton, silk, chanderi, and handloom textiles.
              </p>
            </div>
            <CategoryToolbar total={fabricProducts.length} onSortChange={setSort} />
            <AnimatedGrid className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      )}

      <section className={`py-12 md:py-16 ${fabricProducts.length > 0 ? 'border-t border-accent bg-cream-dark/20' : 'bg-cream'}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-maroon">Fabric Range</p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-charcoal md:text-3xl">
              Thoughtfully Chosen Textiles
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/65 md:text-base">
              Every Boutique Fashion piece begins with the fabric — breathable cottons, rich silks,
              and artisanal textiles selected for comfort, durability, and timeless elegance.
            </p>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
            {fabricTypes.map((fabric) => (
              <FabricTypeCard key={fabric.title} fabric={fabric} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-accent bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {fabricHighlights.map((item) => (
              <div key={item.title} className="border border-accent/60 bg-accent/30 p-6 text-center md:text-left">
                <h3 className="font-serif text-lg text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dress"
              className="inline-block bg-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact-us"
              className="inline-block border border-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-maroon uppercase transition-colors hover:bg-maroon hover:text-cream"
            >
              Custom Fabric Enquiry
            </Link>
          </div>
        </div>
      </section>

      <FaqAccordion faqs={fabricFaqs} />
    </main>
  )
}
