import { Star } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { googleReviews, googleReviewsSummary } from '../../data/about'

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

export default function GoogleReviews() {
  return (
    <section className="bg-cream-dark/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Reviews from Google Business Profile"
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border border-accent bg-cream px-6 py-5">
          <div className="flex items-center gap-2">
            <Stars rating={5} />
            <span className="font-serif text-2xl text-charcoal">{googleReviewsSummary.rating}</span>
          </div>
          <span className="text-sm text-charcoal/50">
            Based on {googleReviewsSummary.totalReviews} reviews on {googleReviewsSummary.source}
          </span>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {googleReviews.map((review) => (
            <div key={review.name} className="border border-accent bg-cream p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-charcoal">{review.name}</p>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-1 text-[10px] tracking-wide text-charcoal/40 uppercase">{review.date}</p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
