import ReturnsCentreLayout from '../components/contact/ReturnsCentreLayout'
import ContactFaq from '../components/contact/ContactFaq'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'
import { buildContactFaqSchema } from '../data/contactFaq'

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contact Us | ${brand.name}`,
    "description": "Get in touch with Boutique Fashion for support, returns, or any inquiries.",
    "url": "https://boutiquefashion.shop/contact-us",
    "mainEntity": {
      "@type": "Organization",
      "name": brand.name,
      "url": "https://boutiquefashion.shop",
      "telephone": brand.phone,
      "email": brand.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1st Floor, Juthika Apartment, A1, 409, Garia Station Rd, Garia",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "postalCode": "700084",
        "addressCountry": "IN"
      }
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brand.name,
    "url": "https://boutiquefashion.shop",
    "image": "https://boutiquefashion.shop/images/about/team-hero.webp",
    "telephone": brand.phone,
    "email": brand.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, Juthika Apartment, A1, 409, Garia Station Rd, Garia",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700084",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "areaServed": "IN",
    "sameAs": [
      "https://www.instagram.com/theboutiquesarees/"
    ]
  }

  const contactFaqSchema = buildContactFaqSchema()

  return (
    <main>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Boutique Fashion for support, returns, or any inquiries." 
        schema={[contactPageSchema, localBusinessSchema, contactFaqSchema]}
      />
      <h1 className="sr-only">Contact Us & Returns Centre</h1>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ReturnsCentreLayout />
        </div>
      </section>
      <ContactFaq />
    </main>
  )
}
