import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { brandAssets } from '../../data/products'

export default function ExclusiveSarees() {
  return (
    <section className="w-full bg-[#f7f4ef] py-10 md:py-14 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-10 md:px-6 lg:gap-16">
        <div>
          <p className="mb-2 font-script text-2xl text-gold md:text-3xl">Exclusive Collection</p>
          <h2 className="font-serif text-3xl font-medium leading-tight text-charcoal md:text-4xl lg:text-5xl">
            Discover Timeless Styles
            <br />
            for Modern Men
          </h2>
          <Link
            to="/mens"
            className="group mt-8 inline-flex items-center gap-2 bg-maroon px-8 py-2.5 text-[10px] font-medium tracking-[0.25em] text-cream uppercase transition-all hover:bg-maroon-light md:py-3 md:text-xs"
          >
            View Collection
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={brandAssets.mensExclusiveBanner}
            alt="Men's Exclusive Collection"
            className="max-h-[480px] w-full object-contain object-center md:max-h-[520px]"
          />
        </div>
      </div>
    </section>
  )
}
