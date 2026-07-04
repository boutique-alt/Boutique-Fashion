import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const gallery = images.length > 0 ? images : []

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0)
  }, [images])

  const prev = () => setActive((a) => (a === 0 ? gallery.length - 1 : a - 1))
  const next = () => setActive((a) => (a === gallery.length - 1 ? 0 : a + 1))

  return (
    <div className="flex gap-3 lg:gap-4">
      {/* Vertical thumbnail strip */}
      {gallery.length > 1 && (
        <div className="hidden w-[72px] shrink-0 flex-col gap-2 sm:flex lg:w-20">
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
          />
        </div>

        {/* Prev/Next arrows on mobile */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:hidden"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image counter badge */}
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm sm:hidden">
            {active + 1}/{gallery.length}
          </span>
        )}

        {/* Mobile dots */}
        {gallery.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-4 bg-maroon' : 'w-1.5 bg-maroon/30'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
