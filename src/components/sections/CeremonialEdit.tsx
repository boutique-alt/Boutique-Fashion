import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { brandAssets } from '../../data/products'

export default function CeremonialEdit() {
  return (
    <section className="w-full bg-[#e8e8e8] py-10 md:py-14">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative flex items-center justify-center">
          <img
            src={brandAssets.newArrivalsBanner}
            alt="New Arrivals"
            className="w-full max-h-[520px] object-contain object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <p className="mb-2 font-script text-2xl text-gold md:text-3xl">New Arrivals</p>
            <h2 className="font-serif text-3xl font-medium text-cream md:text-4xl lg:text-5xl">
              New Arrivals
            </h2>
            <p className="mt-2 max-w-md text-sm tracking-wide text-cream/90">
              Discover Our Signature Styles for Modern Women
            </p>
            <Link
              to="/dress"
              className="group mt-6 flex items-center gap-2 bg-cream px-8 py-2.5 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all hover:bg-maroon hover:text-cream md:mt-8 md:py-3 md:text-xs"
            >
              Shop now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
