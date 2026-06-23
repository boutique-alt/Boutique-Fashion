import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const gallery = images.length > 0 ? images : []

  return (
    <div className="space-y-4">
      <div className="aspect-[480/638] overflow-hidden bg-[#f4f4f4]">
        <img
          src={gallery[active]}
          alt={name}
          className="h-full w-full object-contain object-center"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`aspect-square w-20 overflow-hidden border-2 bg-[#f4f4f4] transition-colors ${
                i === active ? 'border-maroon' : 'border-accent hover:border-maroon/50'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-contain object-center" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
