import { Check } from 'lucide-react'
import { aboutComfort } from '../../data/about'

export default function AboutComfort() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-maroon uppercase">Our Belief</p>
          <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{aboutComfort.title}</h2>
          <p className="mt-3 text-sm text-charcoal/60 md:text-base">{aboutComfort.subtitle}</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {aboutComfort.paragraphs.map((para) => (
            <p key={para.slice(0, 40)} className="text-center text-sm leading-relaxed text-charcoal/70 md:text-base">
              {para}
            </p>
          ))}
        </div>
        <ul className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          {aboutComfort.highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 border border-accent bg-cream px-5 py-4">
              <Check size={16} className="shrink-0 text-maroon" strokeWidth={2} />
              <span className="text-sm text-charcoal/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
