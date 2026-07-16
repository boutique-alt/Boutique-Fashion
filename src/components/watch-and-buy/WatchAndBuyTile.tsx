import { useEffect, useRef } from 'react'
import type { WatchAndBuyItem } from '../../data/watchAndBuyVideos'

interface WatchAndBuyTileProps {
  item: WatchAndBuyItem
  onClick: () => void
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}.00`
}

export default function WatchAndBuyTile({ item, onClick }: WatchAndBuyTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const discount =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = () => {
      video.muted = true
      void video.play().catch(() => {})
    }

    video.addEventListener('loadeddata', playVideo)
    video.addEventListener('canplay', playVideo)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playVideo()
        else video.pause()
      },
      { threshold: 0.15, rootMargin: '40px' },
    )

    observer.observe(video)
    playVideo()

    return () => {
      video.removeEventListener('loadeddata', playVideo)
      video.removeEventListener('canplay', playVideo)
      observer.disconnect()
    }
  }, [item.video])

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-[var(--wb-tile-width)] shrink-0 cursor-pointer text-left"
      style={{ margin: '25px 10px' }}
    >
      <div
        className="overflow-hidden rounded-xl bg-accent"
        style={{ boxShadow: '0px 0px 5px 0px #B0B0B0' }}
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#f0f0f0]">
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-1 py-3">
          <p className="line-clamp-2 text-[13px] leading-snug font-normal text-[#343434]">
            {item.productName}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold text-[#343434]">{formatPrice(item.price)}</span>
            {item.originalPrice && (
              <span className="text-[12px] text-[#808191] line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: 'green' }}>
                -{discount}%
              </span>
            )}
          </div>
          <span
            className="mt-2 inline-block border px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-[#343434] uppercase transition-colors group-hover:bg-[#343434] group-hover:text-white"
            style={{ borderColor: '#343434', borderWidth: '1px' }}
          >
            Shop Now
          </span>
        </div>
      </div>
    </button>
  )
}
