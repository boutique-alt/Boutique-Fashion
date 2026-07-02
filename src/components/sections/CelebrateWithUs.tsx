import { Link } from 'react-router-dom'

export default function CelebrateWithUs() {
  return (
    <section className="border-t border-accent bg-[#fafafa] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
        <h2 className="font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl">
          Exclusive designer brides collection
        </h2>
        <Link
          to="/bridal/women"
          className="mt-6 inline-block border border-charcoal px-8 py-2.5 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all hover:bg-charcoal hover:text-cream md:text-xs"
        >
          View Collection
        </Link>
      </div>
    </section>
  )
}
