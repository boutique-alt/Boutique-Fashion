import { ShieldCheck, Truck, RotateCcw } from 'lucide-react'

export default function TrustBadges() {
  const items = [
    { icon: Truck, title: 'Free Shipping', sub: 'Across India' },
    { icon: RotateCcw, title: '7-Day Returns', sub: 'Easy exchange' },
    { icon: ShieldCheck, title: 'Secure Pay', sub: '100% protected' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 border-t border-accent pt-8">
      {items.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="text-center">
          <Icon size={20} className="mx-auto text-maroon" strokeWidth={1.5} />
          <p className="mt-2 font-serif text-sm text-charcoal">{title}</p>
          <p className="mt-0.5 text-[10px] leading-snug tracking-wide text-charcoal/50 uppercase">{sub}</p>
        </div>
      ))}
    </div>
  )
}
