import PageBanner from '../components/layout/PageBanner'
import ReturnsCentreLayout from '../components/contact/ReturnsCentreLayout'
import { aboutAssets } from '../data/about'

export default function ContactPage() {
  return (
    <main>
      <PageBanner
        title="Returns Centre"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ReturnsCentreLayout />
        </div>
      </section>
    </main>
  )
}
