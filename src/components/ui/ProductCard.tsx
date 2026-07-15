import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '../../data/products'
import { slugFromHref, productPath } from '../../utils/productSlug'
import WishlistButton from '../wishlist/WishlistButton'
import { trackProductClick } from '../../utils/analytics'

interface ProductCardProps {
  product: Product & { slug?: string; newArrivalVideo?: string }
  showVideo?: boolean
}

export default function ProductCard({ product, showVideo }: ProductCardProps) {
  const slug = product.slug ?? slugFromHref(product.href)
  const to = slug ? productPath(slug) : '#'
  const videoRef = useRef<HTMLVideoElement>(null)

  const discount =
    product.onSale && product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const videoSrc = showVideo ? product.newArrivalVideo : undefined

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '100px', threshold: 0.1 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [videoSrc])

  return (
    <div className="group relative">
      <Link
        to={to}
        className="block"
        onClick={() => trackProductClick(product)}
      >
        <div className="relative aspect-[480/638] overflow-hidden bg-[#f4f4f4]">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className="h-full w-full object-cover object-top"
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <>
              <img
                src={product.image}
                alt={product.name}
                className={`h-full w-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                  product.images && product.images.length > 1 ? 'group-hover:opacity-0' : ''
                }`}
                loading="lazy"
                decoding="async"
              />
              {product.images && product.images.length > 1 && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate`}
                  className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </>
          )}
          {product.isNew && (
            <span className="absolute left-2 top-2 bg-charcoal px-2 py-0.5 text-[9px] font-medium tracking-widest text-cream uppercase">
              New
            </span>
          )}
          {product.onSale && discount && (
            <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 text-[9px] font-medium tracking-widest text-cream uppercase">
              -{discount}%
            </span>
          )}
          <span className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-charcoal opacity-0 shadow-none transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <div className="mt-3 px-1 text-left">
          <h3 className="font-sans text-[11px] font-medium uppercase tracking-wide text-charcoal/70 line-clamp-1 transition-colors group-hover:text-maroon">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-[14px] font-bold text-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-[11px] text-charcoal/40 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discount && (
              <span className="font-sans text-[10px] font-bold text-maroon">
                ({discount}% OFF)
              </span>
            )}
          </div>
        </div>
      </Link>
      {slug && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm shadow-none transition-transform hover:scale-105">
          <WishlistButton slug={slug} />
        </div>
      )}
    </div>
  )
}
