import PageBanner from '../components/layout/PageBanner'
import DressCategoryCard from '../components/dress/DressCategoryCard'
import FaqAccordion from '../components/ui/FaqAccordion'
import { dressCategories } from '../data/categories'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'
import { dressFaqs, buildDressFaqSchema } from '../data/dressFaq'
import { useProductCatalog } from '../hooks/useProductCatalog'
import { useMemo } from 'react'

export default function DressPage() {
  const { products: catalog } = useProductCatalog()

  const visibleCategories = useMemo(
    () =>
      dressCategories
        .map((cat) => {
          const products = catalog.filter((p) => p.categorySlug === cat.slug)
          return {
            ...cat,
            count: products.length,
            products: products.length > 0 ? products : cat.products,
          }
        })
        .filter((cat) => cat.count > 0 && cat.products[0]?.image),
    [catalog],
  )

  const dressPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Dresses & Kurta Sets | ${brand.name}`,
    "description": "Discover our collection of premium dresses, kurta sets, and coord sets crafted for elegance.",
    "url": "https://boutiquefashion.shop/dress",
    "isPartOf": {
      "@type": "WebSite",
      "name": brand.name,
      "url": "https://boutiquefashion.shop"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": visibleCategories.length,
      "itemListElement": visibleCategories.map((cat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://boutiquefashion.shop/dress/${cat.slug}`,
        "name": cat.title,
        "description": cat.description
      }))
    }
  }

  const dressFaqSchema = buildDressFaqSchema()

  return (
    <main>
      <SEO
        title="Dresses & Kurta Sets"
        description="Discover our collection of premium dresses, kurta sets, and coord sets crafted for elegance."
        schema={[dressPageSchema, dressFaqSchema]}
      />
      <PageBanner
        title="Dresses & Kurta Sets"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Collection' },
        ]}
      />
      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-maroon">Our Collection</p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-charcoal md:text-3xl">
              Explore by Style
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/65 md:text-base">
              Premium dresses, kurta sets, and coord sets crafted for everyday elegance and special occasions.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((cat) => (
              <DressCategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>
      <FaqAccordion faqs={dressFaqs} />
    </main>
  )
}
