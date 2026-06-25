import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import WatchAndBuyPlayer from '../watch-and-buy/WatchAndBuyPlayer'
import WatchAndBuyTile from '../watch-and-buy/WatchAndBuyTile'
import { watchAndBuyHeading, watchAndBuyVideos } from '../../data/watchAndBuyVideos'

function useTileWidth() {
  const [width, setWidth] = useState(200)

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      if (vw <= 480) {
        setWidth(Math.round(vw * 0.42))
      } else if (vw <= 768) {
        setWidth(Math.round(vw * 0.34))
      } else if (vw <= 1024) {
        setWidth(Math.round(vw * 0.22))
      } else {
        setWidth(Math.round(vw * 0.13))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return width
}

export default function WatchAndBuy() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tileWidth = useTileWidth()
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)

  const scrollBy = useCallback((direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const step = (tileWidth + 20) * 2
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [tileWidth])

  return (
    <section
      className="watch-and-buy overflow-hidden bg-white"
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        ['--wb-tile-width' as string]: `${tileWidth}px`,
      }}
    >
      <h2
        className="mb-4 text-center font-normal text-[#343434]"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 'clamp(24px, 4vw, 40px)',
          lineHeight: 'normal',
          letterSpacing: 'normal',
        }}
      >
        {watchAndBuyHeading}
      </h2>

      <div className="relative mx-auto max-w-[100vw]">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="absolute top-1/2 left-2 z-10 hidden h-24 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-[#343434] shadow-md transition hover:bg-white md:flex"
          style={{ boxShadow: '0px 0px 5px 0px #B0B0B0' }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="absolute top-1/2 right-2 z-10 hidden h-24 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-[#343434] shadow-md transition hover:bg-white md:flex"
          style={{ boxShadow: '0px 0px 5px 0px #B0B0B0' }}
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>

        <div
          ref={trackRef}
          className="flex overflow-x-auto scroll-smooth px-3 md:px-10"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {watchAndBuyVideos.map((item, index) => (
            <WatchAndBuyTile
              key={item.id}
              item={item}
              onClick={() => setPlayerIndex(index)}
            />
          ))}
        </div>
      </div>

      {playerIndex !== null && (
        <WatchAndBuyPlayer
          items={watchAndBuyVideos}
          activeIndex={playerIndex}
          onClose={() => setPlayerIndex(null)}
          onChangeIndex={setPlayerIndex}
        />
      )}
    </section>
  )
}
