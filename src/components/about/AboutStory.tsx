import { aboutAssets, aboutStory } from '../../data/about'

export default function AboutStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-6">
        <div className="overflow-hidden">
          <img
            src={aboutAssets.storyImage}
            alt="Boutique Fashion family"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-maroon uppercase">Our Story</p>
          <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{aboutStory.title}</h2>
          <div className="mt-6 space-y-4">
            {aboutStory.paragraphs.map((para) => (
              <p key={para.slice(0, 40)} className="text-sm leading-relaxed text-charcoal/70 md:text-base">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
