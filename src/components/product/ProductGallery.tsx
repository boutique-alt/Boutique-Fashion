import { useState, useEffect } from 'react'

interface ProductGalleryProps {
  images?: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const gallery = images && images.length > 0 ? images : []

  useEffect(() => {
    setActive(0)
  }, [images])

  if (gallery.length === 0) return null

  return (
    <div className="flex gap-3 lg:gap-4">
      {/* Vertical thumbnail strip for both mobile and desktop */}
      {gallery.length > 1 && (
        <div className="flex w-[60px] shrink-0 flex-col gap-2 sm:w-[72px] lg:w-20">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`aspect-[3/4] w-full overflow-hidden border-2 bg-[#f7f5f2] transition-all ${
                i === active
                  ? 'border-maroon opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90 hover:border-maroon/40'
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1">
        <div className="aspect-[3/4] overflow-hidden bg-[#f7f5f2]">
          <img
            src={gallery[active]}
            alt={name}
            className="h-full w-full object-cover object-top transition-opacity duration-300"
           loading="lazy" />
        </div>
      </div>
    </div>
  )
}
