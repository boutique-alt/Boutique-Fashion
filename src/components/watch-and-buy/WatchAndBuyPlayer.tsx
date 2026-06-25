import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Heart, Share2, Volume2, VolumeX, X } from 'lucide-react'
import type { WatchAndBuyItem } from '../../data/watchAndBuyVideos'

interface WatchAndBuyPlayerProps {
  items: WatchAndBuyItem[]
  activeIndex: number
  onClose: () => void
  onChangeIndex: (index: number) => void
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}.00`
}

export default function WatchAndBuyPlayer({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: WatchAndBuyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [liked, setLiked] = useState(false)
  const item = items[activeIndex]

  const goNext = useCallback(() => {
    onChangeIndex((activeIndex + 1) % items.length)
  }, [activeIndex, items.length, onChangeIndex])

  const goPrev = useCallback(() => {
    onChangeIndex((activeIndex - 1 + items.length) % items.length)
  }, [activeIndex, items.length, onChangeIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    video.currentTime = 0
    void video.play().catch(() => {})
  }, [activeIndex, muted])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: item.productName, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label="Like"
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-red-500' : ''} />
        </button>
      </div>

      <button
        type="button"
        onClick={goPrev}
        className="absolute top-1/2 left-3 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white md:flex"
        aria-label="Previous video"
      >
        <ChevronUp size={24} />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white md:flex"
        aria-label="Next video"
      >
        <ChevronDown size={24} />
      </button>

      <div className="relative h-full w-full max-w-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            className="relative h-full w-full"
          >
            <video
              ref={videoRef}
              src={item.video}
              poster={item.poster}
              muted={muted}
              autoPlay
              playsInline
              loop
              className="h-full w-full object-cover"
              onClick={goNext}
            />

            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              className="absolute right-4 bottom-44 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-16 pb-6">
              <div className="mb-4 flex gap-3">
                <img
                  src={item.productImage}
                  alt=""
                  className="h-16 w-12 shrink-0 rounded object-cover bg-white"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-snug text-white">{item.productName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{formatPrice(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-white/60 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded py-3 text-[11px] font-semibold tracking-[0.15em] text-white uppercase"
                  style={{ backgroundColor: '#000000' }}
                >
                  Add to Cart
                </button>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="flex-1 rounded border border-white bg-white py-3 text-center text-[11px] font-semibold tracking-[0.15em] text-[#343434] uppercase"
                >
                  More Info
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1 md:hidden">
        {items.map((v, i) => (
          <span
            key={v.id}
            className={`h-1 rounded-full transition-all ${i === activeIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
