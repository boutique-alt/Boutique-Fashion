import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { brandAssets, mensCollectionProducts } from '../../data/products'

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
        <div className="relative h-[380px] w-full sm:h-[460px] md:h-[540px]">
          {mensCollectionProducts[0] && (
            <div className="absolute left-0 top-[5%] z-10 h-[75%] w-[60%] overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:z-40 hover:scale-[1.03] hover:shadow-xl">
              <img
                src={mensCollectionProducts[0].image}
                alt={mensCollectionProducts[0].name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
          {mensCollectionProducts[1] && (
            <div className="absolute bottom-[5%] right-[5%] z-20 h-[65%] w-[55%] overflow-hidden rounded-xl border-4 border-[#f7f4ef] shadow-lg transition-all duration-500 hover:z-40 hover:scale-[1.03] hover:shadow-2xl">
              <img
                src={mensCollectionProducts[1].image}
                alt={mensCollectionProducts[1].name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
          {mensCollectionProducts[2] && (
            <div className="absolute right-0 top-0 z-30 h-[45%] w-[40%] overflow-hidden rounded-xl border-4 border-[#f7f4ef] shadow-xl transition-all duration-500 hover:z-40 hover:scale-[1.03] hover:shadow-2xl">
              <img
                src={mensCollectionProducts[2].image}
                alt={mensCollectionProducts[2].name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
