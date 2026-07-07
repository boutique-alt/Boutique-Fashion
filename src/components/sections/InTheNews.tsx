import { Truck, Sparkles, Shield, Store } from 'lucide-react'
import { features } from '../../data/products'

const icons = [Sparkles, Truck, Shield, Store]

export default function InTheNews() {
  return (
    <section className="border-y border-accent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="sr-only">Why Choose Us</h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {features.map((feature, i) => {
            const Icon = icons[i]
            return (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
