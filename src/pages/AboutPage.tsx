import AboutFamilyPhoto from '../components/about/AboutFamilyPhoto'
import AboutStory from '../components/about/AboutStory'
import AboutTimeline from '../components/about/AboutTimeline'
import AboutComfort from '../components/about/AboutComfort'
import AboutFaq from '../components/about/AboutFaq'
import GoogleReviews from '../components/about/GoogleReviews'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'
import { googleReviewsSummary } from '../data/about'
import { buildAboutFaqSchema } from '../data/aboutFaq'

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `About Us | ${brand.name}`,
    "description": "Learn more about Boutique Fashion's heritage, our family story, and our commitment to premium craftsmanship.",
    "url": "https://boutiquefashion.shop/about-us",
    "mainEntity": {
      "@type": "Organization",
      "name": brand.name,
      "url": "https://boutiquefashion.shop"
    }
  }

  const aboutFaqSchema = buildAboutFaqSchema()

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brand.name,
    "url": "https://boutiquefashion.shop",
    "logo": "https://boutiquefashion.shop/images/about/team-hero.webp",
    "description": "Boutique Fashion is a family-owned boutique in Kolkata specialising in premium sarees, bridal wear, dresses, kurta sets, and fabrics since 2018.",
    "foundingDate": "2018",
    "founder": {
      "@type": "Person",
      "name": "Mahua"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, Juthika Apartment, A1, 409, Garia Station Rd, Garia",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700084",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/theboutiquesarees/"
    ],
    "knowsAbout": [
      "Sarees",
      "Bridal wear",
      "Women's dresses",
      "Kurta sets",
      "Handloom fabrics",
      "Ethnic fashion"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": googleReviewsSummary.rating,
      "reviewCount": googleReviewsSummary.totalReviews,
      "bestRating": 5
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": brand.phone,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "bn"]
    }
  }

  return (
    <main>
      <SEO 
        title="About Us" 
        description="Learn more about Boutique Fashion's heritage, our family story, and our commitment to premium craftsmanship." 
        schema={[aboutPageSchema, organizationSchema, aboutFaqSchema]}
      />
      <AboutFamilyPhoto />
      <AboutStory />
      <AboutTimeline />
      
      <section className="bg-cream px-4 py-8 md:px-8 md:py-10 lg:px-12">
        <div className="overflow-hidden border border-accent/60 p-1 md:p-1.5">
          <img
            src="/images/about/team-hero.webp"
            alt="The Boutique Fashion family — generations of craftsmanship and style"
            className="h-[220px] w-full object-cover object-[center_42%] sm:h-[280px] md:h-[340px] lg:h-[540px]"
            loading="lazy"
          />
        </div>
      </section>

      <AboutComfort />
      <GoogleReviews />
      <AboutFaq />
    </main>
  )
}
