import { Truck, Scissors, Headphones, CreditCard, Quote } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import {
  aboutAssets,
  aboutFeatures,
  aboutPillars,
  aboutQuote,
  aboutIntro,
  aboutMission,
  aboutTestimonials,
} from '../data/about'

const featureIcons = [Truck, Scissors, Headphones, CreditCard]

export default function AboutPage() {
  return (
    <main>
      <PageBanner
        title="About Us"
        image={aboutAssets.hero}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6 lg:grid-cols-4">
          {aboutFeatures.map((feature, i) => {
            const Icon = featureIcons[i]
            return (
              <div key={feature.title} className="border border-accent p-6 text-center transition-shadow hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-charcoal">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-cream-dark/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <Quote size={32} className="mb-4 text-gold/50" />
              <blockquote className="font-serif text-2xl leading-relaxed text-charcoal md:text-3xl">
                {aboutQuote}
              </blockquote>
            </div>
            <div className="space-y-4">
              {aboutIntro.map((para) => (
                <p key={para.slice(0, 30)} className="text-sm leading-relaxed text-charcoal/70 md:text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading title="Crafted for Style, Comfort & Confidence" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {aboutPillars.map((pillar, i) => (
              <div key={pillar.title} className="group overflow-hidden">
                <img
                  src={[aboutAssets.image1, aboutAssets.image2, aboutAssets.image3][i]}
                  alt={pillar.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <h3 className="mt-5 font-serif text-xl text-charcoal">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-16 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <img src={aboutAssets.hero} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-serif text-3xl font-medium text-cream md:text-4xl">
            Fashion is more than clothing
          </h2>
          <div className="mt-6 space-y-4">
            {aboutMission.map((para) => (
              <p key={para.slice(0, 30)} className="text-sm leading-relaxed text-cream/70 md:text-base">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Our customers love the quality, craftsmanship, and elegance of our collections"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {aboutTestimonials.map((t) => (
              <div key={t.name} className="border border-accent bg-cream p-8">
                <Quote size={24} className="mb-4 text-gold/40" />
                <p className="text-sm leading-relaxed text-charcoal/80 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 border-t border-accent pt-4">
                  <p className="font-medium text-charcoal">{t.name}</p>
                  <p className="text-xs tracking-wide text-charcoal/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
