import { brand } from '../../data/navigation'

export default function AnnouncementBar() {
  const messages = [
    `FREE SHIPPING on all over India – SHOP NOW`,
    `Need Help? Call ${brand.phone}`,
    brand.tagline,
  ]

  return (
    <div className="relative overflow-hidden bg-maroon py-2.5 text-cream">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(6)].flatMap((_, i) =>
          messages.map((msg, j) => (
            <span key={`${i}-${j}`} className="mx-8 text-xs font-medium tracking-[0.15em] uppercase">
              {msg}
            </span>
          )),
        )}
      </div>
    </div>
  )
}
