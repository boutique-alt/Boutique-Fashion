import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import { aboutAssets, aboutPillars } from '../data/about'

const fabrics = [
  'Pure Cotton & Handloom',
  'Chanderi & Modal',
  'Katan Silk & Brocade',
  'Handblock Prints',
  'Khadi & Embroidery',
]

export default function FabricPage() {
  return (
    <main>
      <PageBanner
        title="Fabric"
        image={aboutAssets.banner}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Fabric' },
        ]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Layers size={32} className="mx-auto text-maroon" strokeWidth={1.5} />
            <h2 className="mt-4 font-serif text-3xl font-medium text-charcoal md:text-4xl">
              Premium Fabrics, Thoughtfully Chosen
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60 md:text-base">
              Every Boutique Fashion piece begins with the fabric — breathable cottons, rich silks,
              and artisanal textiles selected for comfort, durability, and timeless elegance.
            </p>
          </div>

          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aboutPillars.map((pillar) => (
              <div key={pillar.title} className="border border-accent p-6">
                <h3 className="font-serif text-lg text-charcoal">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{pillar.text}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <img
              src={aboutAssets.image2}
              alt="Premium fabrics at Boutique Fashion"
              className="aspect-[4/3] w-full object-cover"
            />
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Our Fabric Range</h3>
              <ul className="mt-6 space-y-3">
                {fabrics.map((fabric) => (
                  <li key={fabric} className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" />
                    {fabric}
                  </li>
                ))}
              </ul>
              <Link
                to="/dress"
                className="mt-8 inline-block bg-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
