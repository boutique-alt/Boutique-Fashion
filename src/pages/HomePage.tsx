import Hero from '../components/sections/Hero'
import CategoryStrip from '../components/sections/CategoryStrip'
import SummerSale from '../components/sections/SummerSale'
import NewArrival from '../components/sections/NewArrival'
import CeremonialEdit from '../components/sections/CeremonialEdit'
import ShopByCategory from '../components/sections/ShopByCategory'
import CelebrateWithUs from '../components/sections/CelebrateWithUs'
import ExclusiveCollections from '../components/sections/ExclusiveCollections'
import OfficeWear from '../components/sections/OfficeWear'
import ExclusiveSarees from '../components/sections/ExclusiveSarees'
import CelebsCorner from '../components/sections/CelebsCorner'
import CustomerReviewGallery from '../components/sections/CustomerReviewGallery'
import CustomerReviews from '../components/sections/CustomerReviews'
import InTheNews from '../components/sections/InTheNews'
import SEO from '../components/ui/SEO'
import CoverflowCarousel from '../components/sections/CoverflowCarousel'
import { brand } from '../data/navigation'

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brand.name,
    "image": "https://boutiquefashion.shop/images/about/team-hero.webp",
    "url": "https://boutiquefashion.shop",
    "telephone": brand.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, Juthika Apartment, A1, 409, Garia Station Rd, Garia",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700084",
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": brand.name,
    "url": "https://boutiquefashion.shop",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://boutiquefashion.shop/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brand.name,
    "url": "https://boutiquefashion.shop",
    "logo": "https://boutiquefashion.shop/images/about/team-hero.webp",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": brand.phone,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": "en"
    }
  }

  return (
    <main>
      <SEO 
        title="Where Comfort meets Confidence" 
        description="Discover premium boutique fashion, exclusive clothing, and accessories at Boutique Fashion." 
        schema={[localBusinessSchema, websiteSchema, organizationSchema]}
      />
      <Hero />
      <CategoryStrip />
      <CoverflowCarousel />
      <SummerSale />
      <NewArrival />
      <CeremonialEdit />
      <ShopByCategory />
      <CelebrateWithUs />
      <ExclusiveCollections />
      <OfficeWear />
      <ExclusiveSarees />
      <CustomerReviewGallery />
      <CustomerReviews />
      <CelebsCorner />
      <InTheNews />
    </main>
  )
}
