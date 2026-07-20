import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const carouselItems = [
  {
    id: 1,
    title: "Floral Dress with Jacket",
    subtitle: "Cream and red handblock",
    image: "/images/suit-set/new_01.webp",
    link: "/shop/all",
    bgColor: "#8b1c1c" // Deep Red
  },
  {
    id: 2,
    title: "Dual-Tone Printed Dress",
    subtitle: "Red and blue motifs",
    image: "/images/suit-set/new_02.webp",
    link: "/shop/all",
    bgColor: "#1a5b8f" // Bright Blue
  },
  {
    id: 3,
    title: "Rust Geometric Co-ord",
    subtitle: "With white tribal motifs",
    image: "/images/suit-set/new_03.webp",
    link: "/shop/all",
    bgColor: "#b05229" // Rust Orange
  },
  {
    id: 4,
    title: "Blue Geometric Co-ord",
    subtitle: "With white tribal motifs",
    image: "/images/suit-set/new_04.webp",
    link: "/shop/all",
    bgColor: "#236ca9" // Bright Blue
  },
  {
    id: 5,
    title: "Brick Red Printed Set",
    subtitle: "With matching dupatta",
    image: "/images/suit-set/new_05.webp",
    link: "/shop/all",
    bgColor: "#7f1d1d" // Brick Red
  },
  {
    id: 6,
    title: "Black Velvet Lehengha",
    subtitle: "With gold foil print skirt",
    image: "/images/suit-set/new_06.webp",
    link: "/shop/all",
    bgColor: "#171717" // Deep Black
  },
  {
    id: 7,
    title: "Deep Purple Silk Suit",
    subtitle: "With bright pink dupatta",
    image: "/images/suit-set/new_07.webp",
    link: "/shop/all",
    bgColor: "#3b0764" // Deep Purple
  },
  {
    id: 8,
    title: "Crimson Red Anarkali",
    subtitle: "With heavy embroidered jacket",
    image: "/images/suit-set/new_08.webp",
    link: "/shop/all",
    bgColor: "#7f1d1d" // Deep Crimson
  },
  {
    id: 9,
    title: "Plum Silk Kurta Set",
    subtitle: "With sheer organza palazzo",
    image: "/images/suit-set/new_09.webp",
    link: "/shop/all",
    bgColor: "#4c1d95" // Plum
  },
  {
    id: 10,
    title: "Magenta Sharara Set",
    subtitle: "With intricate mirror work",
    image: "/images/suit-set/new_10.webp",
    link: "/shop/all",
    bgColor: "#9d174d" // Deep Magenta
  },
  {
    id: 11,
    title: "Yellow Embroidered Lehenga",
    subtitle: "With delicate floral motifs",
    image: "/images/suit-set/new_11.webp",
    link: "/shop/all",
    bgColor: "#ca8a04" // Gold Yellow
  },
  {
    id: 12,
    title: "Yellow Silk Anarkali",
    subtitle: "With floral organza dupatta",
    image: "/images/suit-set/new_12.webp",
    link: "/shop/all",
    bgColor: "#eab308" // Bright Yellow
  },
  {
    id: 13,
    title: "Maroon Georgette Suit",
    subtitle: "With intricate zari border",
    image: "/images/suit-set/new_13.webp",
    link: "/shop/all",
    bgColor: "#500724" // Deep Maroon
  },
  {
    id: 14,
    title: "Mint Green Palazzo Set",
    subtitle: "With embellished jacket",
    image: "/images/suit-set/new_14.webp",
    link: "/shop/all",
    bgColor: "#86efac" // Soft Mint Green
  }
]

export default function CoverflowCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  return (
    <section className="relative w-full overflow-hidden bg-stone-50 py-16 md:py-24">
      <div className="mx-auto w-full px-4 md:max-w-none md:px-12 lg:px-24">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-light tracking-wide text-charcoal md:text-4xl">
            The Boutiqtian's Edit
          </h2>
          <p className="mt-4 font-accent text-sm tracking-widest text-charcoal/60 uppercase">
            Everyday Luxury
          </p>
        </div>

        <div className="relative mx-auto flex h-[400px] w-full max-w-5xl items-center justify-center md:h-[550px] lg:h-[650px] md:max-w-none">
          {/* Dynamic Background Circle */}
          <div 
            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000 ease-in-out md:h-[850px] md:w-[850px] lg:h-[1000px] lg:w-[1000px]"
            style={{ backgroundColor: carouselItems[currentIndex].bgColor }}
          />
          
          {carouselItems.map((item, index) => {
            const total = carouselItems.length;
            let diff = index - currentIndex;
            
            // Handle wrap-around for smooth circular effect
            if (diff < -Math.floor(total / 2)) diff += total;
            if (diff > Math.floor(total / 2)) diff -= total;
            
            const isCenter = diff === 0;
            
            // Calculate exact position percentages
            let xPos = '-50%';
            if (diff === -1) xPos = '-130%';
            else if (diff === 1) xPos = '30%';
            else if (diff <= -2) xPos = '-200%';
            else if (diff >= 2) xPos = '100%';

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{ 
                  opacity: isCenter ? 1 : Math.abs(diff) === 1 ? 0.85 : 0,
                  x: xPos,
                  scale: isCenter ? 1 : 0.75,
                  zIndex: isCenter ? 10 : Math.abs(diff) === 1 ? 5 : 0,
                  filter: 'blur(0px)',
                  pointerEvents: isCenter ? 'auto' : 'none'
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.32, 0.72, 0, 1]
                }}
                className="absolute left-1/2 top-0 flex h-full w-[220px] flex-col items-center justify-center md:w-[360px] lg:w-[440px]"
              >
                <div className={`relative h-[280px] w-full overflow-hidden rounded-2xl border-[6px] border-white bg-accent shadow-xl transition-all duration-500 md:h-[480px] lg:h-[550px] md:border-[10px] ${isCenter ? 'shadow-black/20' : 'shadow-black/5'}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                   loading="lazy" />
                  {isCenter && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center"
                    >
                      <h3 className="font-serif text-lg font-medium text-white md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-light text-white/80">
                        {item.subtitle}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-accent/80 text-charcoal shadow-lg backdrop-blur hover:bg-accent hover:text-maroon md:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-accent/80 text-charcoal shadow-lg backdrop-blur hover:bg-accent hover:text-maroon md:right-8"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
