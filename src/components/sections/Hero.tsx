import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { brandAssets, heroSlides } from '../../data/products'

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
      className="under-site-header relative w-full overflow-x-hidden"
      style={{ backgroundColor: slide.bgColor }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/20 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-[var(--site-header-height)] flex justify-center pt-4 md:pt-6">
        <img
          src={brandAssets.logo}
          alt=""
          aria-hidden
          className="h-14 w-auto opacity-[0.07] mix-blend-multiply md:h-20 md:opacity-[0.1]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-10 lg:pb-16 lg:pt-12">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.45 }}
              className="order-2 md:order-1"
            >
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-12 bg-maroon/50 md:w-16" />
                <p className="font-script text-[2rem] leading-none text-maroon drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                  {slide.tag}
                </p>
              </div>
              <h1 className="font-serif text-[1.875rem] font-medium leading-[1.12] tracking-tight text-charcoal sm:text-4xl lg:text-[2.875rem]">
                {slide.title}
                <span className="mt-1 block font-light text-charcoal/90">{slide.subtitle}</span>
              </h1>
              <div className="mt-5 h-px w-16 bg-maroon/30" />
              {slide.description && (
                <p className="mt-5 max-w-md font-accent text-sm font-light leading-[1.8] tracking-wide text-charcoal/65 md:text-[15px]">
                  {slide.description}
                </p>
              )}
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to={slide.href}
                  className="rounded-full bg-maroon px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] text-cream uppercase shadow-md transition-all hover:bg-maroon-light hover:shadow-lg md:text-xs"
                >
                  {slide.cta}
                </Link>
                <Link
                  to="/shop/all"
                  className="rounded-full border border-charcoal/15 bg-white/40 px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] text-charcoal uppercase backdrop-blur-sm transition-all hover:border-maroon hover:text-maroon md:text-xs"
                >
                  Shop All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative order-1 md:order-2">
            <div className="relative mx-auto flex min-h-[380px] w-full max-w-md items-center justify-center py-4 md:min-h-[460px] md:max-w-none lg:min-h-[540px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-full w-full items-start justify-center pt-2 md:items-center md:pt-0"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-[min(520px,65vh)] w-full object-contain md:max-h-[560px]"
                    style={{ objectPosition: slide.objectPosition ?? 'center' }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white/60 text-charcoal backdrop-blur-sm transition-colors hover:border-maroon hover:text-maroon"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white/60 text-charcoal backdrop-blur-sm transition-colors hover:border-maroon hover:text-maroon"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
