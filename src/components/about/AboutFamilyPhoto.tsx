import { aboutStory } from '../../data/about'

export default function AboutFamilyPhoto() {
  return (
    <section className="w-full">
      <div className=" bg-cream px-4 py-8 text-center md:px-6 md:py-10">
        <p className="text-xs font-medium tracking-[0.2em] text-maroon uppercase">About Us</p>
        <h1 className="mt-2 font-serif text-xl text-charcoal md:text-2xl">{aboutStory.title}</h1>
        <span className="mx-auto mt-4 block h-px w-10 bg-gold" />
      </div>
    </section>
  )
}
