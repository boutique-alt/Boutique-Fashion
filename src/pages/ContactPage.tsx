import ReturnsCentreLayout from '../components/contact/ReturnsCentreLayout'
import SEO from '../components/ui/SEO'
import { brand } from '../data/navigation'

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

  return (
    <main>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Boutique Fashion for support, returns, or any inquiries." 
        schema={contactPageSchema}
      />
      <h1 className="sr-only">Contact Us & Returns Centre</h1>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ReturnsCentreLayout />
        </div>
      </section>
    </main>
  )
}
