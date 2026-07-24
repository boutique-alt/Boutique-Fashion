import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroSlides } from '../../data/products'

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
      <section
        className="relative w-full overflow-x-hidden transition-colors duration-700 min-h-[400px] md:min-h-[500px] md:aspect-video flex flex-col md:justify-center"
        style={{ backgroundColor: slide.bgColor }}
      >

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover md:object-center"
              style={{ objectPosition: isMobile ? (slide.mobileObjectPosition || 'center') : (slide.objectPosition || 'center') }}
              fetchPriority={current === 0 ? 'high' : 'low'}
              decoding="async"
              loading={current === 0 ? "eager" : "lazy"} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 bg-black/25 md:hidden" />

        <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-charcoal/20 to-transparent z-10 hidden md:block" />

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-cream to-transparent z-20 pointer-events-none" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 pb-6 pt-[110px] md:px-6 md:pb-14 md:pt-36 lg:pb-16 lg:pt-36 w-full">
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
                <div className="relative z-20 max-w-[85%] md:max-w-none">
                  <div className="mb-4 md:mb-6">
                    <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white drop-shadow-md font-semibold inline-block">
                      {slide.tag}
                    </p>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-light leading-[1.15] tracking-wide text-white drop-shadow-md md:text-5xl lg:text-[3.25rem]">
                    {slide.title}
                    <span className="mt-1 md:mt-2 block font-medium italic text-white/95">{slide.subtitle}</span>
                  </h1>
                  <p className="sr-only">{slide.title} {slide.subtitle}</p>
                  <div className="mt-3 md:mt-5 h-px w-12 md:w-16 bg-white/60" />
                  {slide.description && (
                    <p className="mt-3 md:mt-5 max-w-md font-accent text-xs sm:text-sm font-light leading-[1.6] md:leading-[1.8] tracking-wide text-white/90 drop-shadow-md md:text-[15px]">
                      {slide.description}
                    </p>
                  )}
                </div>
                <div className="mt-6 md:mt-10 flex flex-wrap gap-4 relative z-20">
                  <Link
                    to={slide.href}
                    className="group relative overflow-hidden rounded-none border border-white/80 bg-white/10 px-10 py-3.5 text-[10px] font-medium tracking-[0.25em] text-white uppercase transition-all duration-500 hover:text-charcoal md:text-[11px]"
                  >
                    <span className="relative z-10">{slide.cta}</span>
                    <div className="absolute inset-0 -z-0 h-full w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
                  </Link>
                  <Link
                    to="/shop/all"
                    className="group relative overflow-hidden rounded-none border border-white/40 bg-white/5 px-10 py-3.5 text-[10px] font-medium tracking-[0.25em] text-white uppercase transition-all duration-500 hover:text-charcoal md:text-[11px]"
                  >
                    <span className="relative z-10">Shop All</span>
                    <div className="absolute inset-0 -z-0 h-full w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
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
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-maroon' : 'w-2 bg-charcoal/25 hover:bg-charcoal/40'
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
