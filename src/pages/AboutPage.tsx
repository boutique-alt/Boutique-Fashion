import AboutFamilyPhoto from '../components/about/AboutFamilyPhoto'
import AboutStory from '../components/about/AboutStory'
import AboutTimeline from '../components/about/AboutTimeline'
import AboutComfort from '../components/about/AboutComfort'
import GoogleReviews from '../components/about/GoogleReviews'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'

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
        title="About Us" 
        description="Learn more about Boutique Fashion's heritage, our family story, and our commitment to premium craftsmanship." 
        schema={[aboutPageSchema, organizationSchema]}
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
    </main>
  )
}
