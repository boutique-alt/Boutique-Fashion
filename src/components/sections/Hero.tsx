import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { brandAssets, heroSlides } from '../../data/products'
import CategoryStrip from './CategoryStrip'

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined

    const start = () => {
      timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % heroSlides.length)
      }, 5000)
    }

    const stop = () => {
      if (timer) clearInterval(timer)
      timer = undefined
    }

    const onVisibility = () => {
      stop()
      if (document.visibilityState === 'visible') start()
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const slide = heroSlides[current]

  return (
    <section
      className="relative w-full overflow-x-hidden transition-colors duration-700"
      style={{ backgroundColor: slide.bgColor }}
    >
      <CategoryStrip />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/20 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4 md:pt-6">
        <img
          src={brandAssets.logo}
          alt=""
          aria-hidden
          className="h-16 w-auto rounded-xl opacity-[0.05] mix-blend-multiply md:h-24 lg:h-32 md:opacity-[0.08]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-10 lg:pb-16 lg:pt-12">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 md:order-1"
            >
              <div className="mb-6">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-maroon font-semibold">
                  {slide.tag}
                </p>
              </div>
              <h1 className="font-serif text-3xl font-light leading-[1.15] tracking-wide text-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                {slide.title}
                <span className="mt-2 block font-medium italic text-charcoal/90">{slide.subtitle}</span>
              </h1>
              <p className="sr-only">{slide.title} {slide.subtitle}</p>
              <div className="mt-5 h-px w-16 bg-maroon/30" />
              {slide.description && (
                <p className="mt-5 max-w-md font-accent text-sm font-light leading-[1.8] tracking-wide text-charcoal/65 md:text-[15px]">
                  {slide.description}
                </p>
              )}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to={slide.href}
                  className="group relative overflow-hidden rounded-none border border-charcoal px-10 py-3.5 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all duration-500 hover:text-white md:text-[11px]"
                >
                  <span className="relative z-10">{slide.cta}</span>
                  <div className="absolute inset-0 -z-0 h-full w-0 bg-charcoal transition-all duration-500 ease-out group-hover:w-full" />
                </Link>
                <Link
                  to="/shop/all"
                  className="group relative overflow-hidden rounded-none border border-transparent px-8 py-3.5 text-[10px] font-medium tracking-[0.25em] text-charcoal/70 uppercase transition-all duration-500 hover:text-charcoal md:text-[11px]"
                >
                  <span className="relative z-10">Shop All</span>
                  <div className="absolute bottom-2 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-charcoal transition-all duration-500 ease-out group-hover:w-1/2" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative order-1 md:order-2">
            <div className="relative mx-auto flex min-h-[380px] w-full max-w-md items-center justify-center py-4 md:min-h-[460px] md:max-w-none lg:min-h-[540px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full w-full items-start justify-center pt-2 md:items-center md:pt-0"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-[min(520px,65vh)] w-full object-contain md:max-h-[560px]"
                    style={{ objectPosition: slide.objectPosition ?? 'center' }}
                    fetchPriority={current === 0 ? 'high' : 'low'}
                    decoding="async"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-accent/60 text-charcoal backdrop-blur-sm transition-colors hover:border-maroon hover:text-maroon"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-accent/60 text-charcoal backdrop-blur-sm transition-colors hover:border-maroon hover:text-maroon"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
