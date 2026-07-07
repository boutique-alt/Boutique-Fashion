import ReturnsCentreLayout from '../components/contact/ReturnsCentreLayout'
import SEO from '../components/ui/SEO'

export default function ContactPage() {
  return (
    <main>
      <SEO title="Contact Us" description="Get in touch with Boutique Fashion for support, returns, or any inquiries." />
      <h1 className="sr-only">Contact Us & Returns Centre</h1>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ReturnsCentreLayout />
        </div>
      </section>
    </main>
  )
}
