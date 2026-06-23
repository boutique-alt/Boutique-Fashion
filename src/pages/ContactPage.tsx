import { Mail, MapPin, Phone } from 'lucide-react'
import ContactForm from '../components/contact/ContactForm'
import PageBanner from '../components/layout/PageBanner'
import { brand } from '../data/navigation'
import { contactAssets } from '../data/contact'
import { aboutAssets } from '../data/about'

export default function ContactPage() {
  return (
    <main>
      <PageBanner
        title="Contact Us"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-medium text-charcoal md:text-4xl">
              Hello! Tell Us About Your Thinking
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/60">
              Contact us with your details &amp; ready to start. Let&apos;s provide us a message &amp; contact us!
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-6 font-serif text-xl text-charcoal">Send A Message</h3>
              <p className="mb-6 text-sm text-charcoal/60">Ask us anything here</p>
              <ContactForm />
            </div>

            <div>
              <img
                src={contactAssets.image}
                alt="Contact Boutique Fashion"
                className="mb-8 aspect-[4/3] w-full object-cover"
              />
              <h3 className="mb-6 font-serif text-xl text-charcoal">Contact Information</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <a href={`mailto:${brand.email}`} className="text-sm text-charcoal/70 transition-colors hover:text-maroon">
                    {brand.email}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="text-sm text-charcoal/70 transition-colors hover:text-maroon">
                    {brand.phone}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <span className="text-sm leading-relaxed text-charcoal/70">{brand.address}</span>
                </li>
              </ul>
              <div className="mt-8 border-t border-accent pt-8">
                <h4 className="mb-3 font-serif text-lg text-charcoal">Follow Us</h4>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-maroon transition-colors hover:text-gold"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
