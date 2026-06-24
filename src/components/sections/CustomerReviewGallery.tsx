import { reviewGalleryImages } from '../../data/reviews'

export default function CustomerReviewGallery() {
  const track = [...reviewGalleryImages, ...reviewGalleryImages]

  return (
    <section className="overflow-hidden bg-cream-dark/30 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
          Customer Moments
        </h2>
      </div>

      <div className="marquee-pause-hover relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream-dark/80 to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream-dark/80 to-transparent md:w-20" />
        <div className="marquee-track flex w-max animate-marquee-gallery">
          {track.map((image, i) => (
            <div key={`${image.id}-${i}`} className="mx-2 shrink-0 md:mx-3">
              <img
                src={image.src}
                alt={image.alt}
                className="h-[280px] w-[200px] object-cover object-center md:h-[340px] md:w-[240px]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
