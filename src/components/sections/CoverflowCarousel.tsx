import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const carouselItems = [
  {
    id: 1,
    title: "Green Embroidered Suit Set",
    subtitle: "With bright pink dupatta",
    image: "/images/suit-set/01.png",
    link: "/shop/all",
    bgColor: "#588157" // Deep Sage Green
  },
  {
    id: 2,
    title: "Teal Blue Suit Set",
    subtitle: "With printed beige dupatta",
    image: "/images/suit-set/02.png",
    link: "/shop/all",
    bgColor: "#1d4e89" // Deep Teal
  },
  {
    id: 3,
    title: "Navy Blue Suit Set",
    subtitle: "With maroon printed dupatta",
    image: "/images/suit-set/03.png",
    link: "/shop/all",
    bgColor: "#1e293b" // Navy Blue
  },
  {
    id: 4,
    title: "Mustard Yellow Suit Set",
    subtitle: "With dark printed dupatta",
    image: "/images/suit-set/04.png",
    link: "/shop/all",
    bgColor: "#b4841a" // Mustard
  },
  {
    id: 5,
    title: "Red Embroidered Suit Set",
    subtitle: "With printed beige dupatta",
    image: "/images/suit-set/05.png",
    link: "/shop/all",
    bgColor: "#991b1b" // Deep Red
  },
  {
    id: 6,
    title: "Terracotta Suit Set",
    subtitle: "With geometric dupatta",
    image: "/images/suit-set/06.png",
    link: "/shop/all",
    bgColor: "#9a3412" // Terracotta
  },
  {
    id: 7,
    title: "Cream Floral Suit Set",
    subtitle: "With elegant floral dupatta",
    image: "/images/suit-set/07.png",
    link: "/shop/all",
    bgColor: "#a39485" // Warm Grey/Beige
  },
  {
    id: 8,
    title: "Brick Red Printed Set",
    subtitle: "With matching dupatta",
    image: "/images/suit-set/08.png",
    link: "/shop/all",
    bgColor: "#7f1d1d" // Brick Red
  },
  {
    id: 9,
    title: "White Coord Set",
    subtitle: "With delicate embroidery",
    image: "/images/suit-set/09.png",
    link: "/shop/all",
    bgColor: "#a3b18a" // Soft Sage for contrast
  },
  {
    id: 10,
    title: "Off-White Suit Set",
    subtitle: "With olive green dupatta",
    image: "/images/suit-set/10.png",
    link: "/shop/all",
    bgColor: "#606c38" // Olive Green
  },
  {
    id: 11,
    title: "Brown Embroidered Suit Set",
    subtitle: "With printed light dupatta",
    image: "/images/suit-set/11.png",
    link: "/shop/all",
    bgColor: "#5c4033" // Dark Brown
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

  const getVisibleItems = () => {
    const total = carouselItems.length
    const items = []
    
    // Previous (Left)
    items.push({
      ...carouselItems[(currentIndex - 1 + total) % total],
      position: -1,
      zIndex: 0
    })
    
    // Current (Center)
    items.push({
      ...carouselItems[currentIndex],
      position: 0,
      zIndex: 10
    })
    
    // Next (Right)
    items.push({
      ...carouselItems[(currentIndex + 1) % total],
      position: 1,
      zIndex: 0
    })

    return items
  }

  return (
    <section className="relative w-full overflow-hidden bg-stone-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-light tracking-wide text-charcoal md:text-4xl">
            The Boutiqtian's Edit
          </h2>
          <p className="mt-4 font-accent text-sm tracking-widest text-charcoal/60 uppercase">
            Everyday Luxury
          </p>
        </div>

        <div className="relative mx-auto flex h-[400px] w-full max-w-5xl items-center justify-center md:h-[500px]">
          {/* Dynamic Background Circle */}
          <div 
            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000 ease-in-out md:h-[550px] md:w-[550px]"
            style={{ backgroundColor: carouselItems[currentIndex].bgColor }}
          />
          
          {carouselItems.map((item, index) => {
            const total = carouselItems.length;
            let diff = index - currentIndex;
            
            // Handle wrap-around for smooth circular effect
            if (diff < -Math.floor(total / 2)) diff += total;
            if (diff > Math.floor(total / 2)) diff -= total;
            
            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;
            
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
                className="absolute left-1/2 top-0 flex h-full w-[220px] flex-col items-center justify-center md:w-[280px]"
              >
                <div className={`relative h-[280px] w-full overflow-hidden rounded-2xl border-[6px] border-white bg-accent shadow-xl transition-all duration-500 md:h-[380px] md:border-[8px] ${isCenter ? 'shadow-black/20' : 'shadow-black/5'}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
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
