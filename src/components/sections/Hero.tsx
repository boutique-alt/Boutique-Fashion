import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { brandAssets, heroSlides } from '../../data/products'
import CategoryStrip from './CategoryStrip'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <>
      <div className="w-full relative z-20 transition-colors duration-700" style={{ backgroundColor: slide.bgColor }}>
        <CategoryStrip />
      </div>
      <section
        className="relative w-full overflow-x-hidden transition-colors duration-700 min-h-[500px] md:aspect-video flex flex-col md:justify-center"
        style={{ backgroundColor: slide.bgColor }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="relative w-full aspect-[4/3] sm:aspect-video md:absolute md:inset-0 md:aspect-auto z-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover object-right md:object-center"
              style={{ objectPosition: slide.objectPosition }}
              fetchPriority={current === 0 ? 'high' : 'low'}
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4 md:pt-6 z-10">
        <img
          src={brandAssets.logo}
          alt=""
          aria-hidden
          className="h-16 w-auto rounded-xl opacity-[0.05] mix-blend-multiply md:h-24 lg:h-32 md:opacity-[0.08]"
        />
      </div>

      <div className="md:relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-10 lg:pb-16 lg:pt-12 w-full">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={isMobile ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 md:order-1 md:relative z-10"
            >
              <div className="absolute top-6 left-4 max-w-[55%] z-20 md:static md:max-w-none">
                <div className="mb-4 md:mb-6">
                  <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white drop-shadow-md md:drop-shadow-none md:text-maroon font-semibold inline-block">
                    {slide.tag}
                  </p>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-light leading-[1.15] tracking-wide text-white drop-shadow-md md:drop-shadow-none md:text-charcoal md:text-5xl lg:text-[3.25rem]">
                  {slide.title}
                  <span className="mt-1 md:mt-2 block font-medium italic text-white/90 md:text-charcoal/90">{slide.subtitle}</span>
                </h1>
                <p className="sr-only">{slide.title} {slide.subtitle}</p>
                <div className="mt-3 md:mt-5 h-px w-12 md:w-16 bg-white/60 md:bg-maroon/30" />
                {slide.description && (
                  <p className="mt-3 md:mt-5 max-w-md font-accent text-xs sm:text-sm font-light leading-[1.6] md:leading-[1.8] tracking-wide text-white/90 drop-shadow-md md:drop-shadow-none md:text-charcoal/80 md:text-[15px]">
                    {slide.description}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-10 flex flex-wrap gap-4 relative z-10">
                <Link
                  to={slide.href}
                  className="group relative overflow-hidden rounded-none border border-charcoal px-10 py-3.5 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all duration-500 hover:text-white md:text-[11px]"
                >
                  <span className="relative z-10">{slide.cta}</span>
                  <div className="absolute inset-0 -z-0 h-full w-0 bg-charcoal transition-all duration-500 ease-out group-hover:w-full" />
                </Link>
                <Link
                  to="/shop/all"
                  className="group relative overflow-hidden rounded-none border border-transparent px-8 py-3.5 text-[10px] font-medium tracking-[0.25em] text-charcoal/90 uppercase transition-all duration-500 hover:text-charcoal md:text-[11px]"
                >
                  <span className="relative z-10">Shop All</span>
                  <div className="absolute bottom-2 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-charcoal transition-all duration-500 ease-out group-hover:w-1/2" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:mt-10 relative z-10">
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
    </>
  )
}
