import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroSlides } from '../../data/products'

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[current]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: slide.bgColor }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream/30 to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream/30 to-transparent opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.45 }}
              className="order-2 md:order-1"
            >
              <p className="mb-3 font-script text-2xl text-gold md:text-3xl lg:text-4xl">
                {slide.tag}
              </p>
              <h1 className="font-serif text-3xl font-medium leading-tight text-charcoal sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-2 font-serif text-xl font-light text-charcoal/85 md:text-2xl">
                {slide.subtitle}
              </p>
              {slide.description && (
                <p className="mt-5 max-w-md text-sm leading-relaxed text-charcoal/60 md:text-base">
                  {slide.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={slide.href}
                  className="rounded-full bg-gradient-to-r from-[#f0e0d6] via-[#ede8f0] to-[#e8dff5] px-7 py-3 text-xs font-medium tracking-wide text-charcoal shadow-sm transition-all hover:shadow-md md:text-sm"
                >
                  {slide.cta}
                </Link>
                <Link
                  to="/shop"
                  className="rounded-full border border-charcoal/20 bg-cream/60 px-7 py-3 text-xs font-medium tracking-wide text-charcoal backdrop-blur-sm transition-all hover:border-maroon hover:text-maroon md:text-sm"
                >
                  Shop All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative order-1 md:order-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md md:aspect-[3/4] md:max-w-none lg:h-[520px] lg:aspect-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-full w-full object-contain object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-cream/70 text-charcoal transition-colors hover:border-maroon hover:text-maroon"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex max-w-[240px] flex-wrap justify-center gap-2 md:max-w-none">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-maroon' : 'w-2 bg-charcoal/25 hover:bg-charcoal/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-cream/70 text-charcoal transition-colors hover:border-maroon hover:text-maroon"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
