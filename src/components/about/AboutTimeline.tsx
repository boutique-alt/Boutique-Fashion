import SectionHeading from '../ui/SectionHeading'
import { aboutTimeline } from '../../data/about'

export default function AboutTimeline() {
  return (
    <section className="bg-cream-dark/50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SectionHeading title="Our Journey" subtitle="Milestones that shaped Boutique Fashion" />
        <div className="relative mt-12">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-accent md:left-1/2 md:-translate-x-px" />
          <ul className="space-y-10">
            {aboutTimeline.map((item, i) => (
              <li
                key={item.year}
                className={`relative flex flex-col gap-4 md:flex-row md:items-start ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="hidden flex-1 md:block" />
                <div className="absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-maroon bg-cream md:left-1/2" />
                <div className={`flex-1 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                  <span className="font-serif text-lg text-maroon">{item.year}</span>
                  <h3 className="mt-1 font-serif text-xl text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
