import { aboutStory } from '../../data/about'

export default function AboutStory() {
  return (
    <section className="border-t border-accent/60 py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        <p className="text-xs font-medium tracking-[0.2em] text-maroon uppercase">Our Story</p>
        <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">{aboutStory.title}</h2>
        <span className="mx-auto mt-5 block h-px w-12 bg-gold" />
        <div className="mt-8 space-y-5">
          {aboutStory.paragraphs.map((para) => (
            <p key={para.slice(0, 40)} className="text-sm leading-relaxed text-charcoal/65 md:text-base">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
