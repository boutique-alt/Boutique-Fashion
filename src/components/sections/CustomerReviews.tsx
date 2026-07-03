import { Star } from 'lucide-react'
import { customerReviews, type CustomerReview } from '../../data/reviews'
import { useInView } from '../../hooks/useInView'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-gold text-gold' : 'text-charcoal/20'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="mx-4 w-[300px] shrink-0 px-2 md:w-[360px]">
      <Stars rating={review.rating} />
      <h3 className="mt-4 font-serif text-xl text-charcoal md:text-2xl">{review.name}</h3>
      <p className="mt-1 text-xs tracking-wide text-charcoal/50">{review.location}</p>
      <h4 className="mt-4 text-sm font-semibold text-charcoal md:text-base">{review.headline}</h4>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/65 md:text-[15px]">{review.text}</p>
    </article>
  )
}

export default function CustomerReviews() {
  const track = [...customerReviews, ...customerReviews]
  const { ref, inView } = useInView<HTMLElement>('200px')

  return (
    <section ref={ref} className={`overflow-hidden bg-cream py-14 md:py-20${inView ? '' : ' marquee-pause-offscreen'}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
          From Our Customers
        </h2>
      </div>

      <div className="marquee-pause-hover relative mt-10 overflow-hidden md:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream to-transparent md:w-20" />
        <div className="marquee-track flex w-max animate-marquee-reviews">
          {track.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
