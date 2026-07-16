import Hero from '../components/sections/Hero'
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

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Boutique Fashion",
    "image": "https://boutiquefashion.shop/images/about/team-hero.png",
    "url": "https://boutiquefashion.shop",
    "telephone": "+918777708573",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "36/C, T.N.Bhiswas Road, Kolkata",
      "addressLocality": "Kolkata",
      "addressRegion": "WB",
      "postalCode": "700035",
      "addressCountry": "IN"
    },
    "priceRange": "$$"
  }

  return (
    <main>
      <SEO 
        title="Where Comfort meets Confidence" 
        description="Discover premium boutique fashion, exclusive clothing, and accessories at Boutique Fashion." 
        schema={localBusinessSchema}
      />
      <Hero />
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
