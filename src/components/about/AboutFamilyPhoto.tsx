import { aboutStory } from '../../data/about'

export default function AboutFamilyPhoto() {
  return (
    <section className="w-full">
      <div className=" bg-cream px-4 py-8 text-center md:px-6 md:py-10">
        <p className="text-xs font-medium tracking-[0.2em] text-maroon uppercase">About Us</p>
        <h1 className="mt-2 font-serif text-xl text-charcoal md:text-2xl">{aboutStory.title}</h1>
        <span className="mx-auto mt-4 block h-px w-10 bg-gold" />
      </div>
      <div className="bg-cream px-4 py-8 md:px-8 md:py-10 lg:px-12">
        <div className="overflow-hidden border border-accent/60 p-1 md:p-1.5">
          <img
            src="/images/about/team-hero.png"
            alt="The Boutique Fashion family — generations of craftsmanship and style"
            className="h-[220px] w-full object-cover object-[center_42%] sm:h-[280px] md:h-[340px] lg:h-[540px]"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
