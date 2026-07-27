import type { FabricType } from '../../data/fabricTypes'

interface FabricTypeCardProps {
  fabric: FabricType
}

export default function FabricTypeCard({ fabric }: FabricTypeCardProps) {
  return (
    <article className="group flex h-full min-w-[220px] snap-start flex-col overflow-hidden border border-accent/70 bg-cream transition-shadow hover:shadow-md sm:min-w-[240px] lg:min-w-0">
      <div className="relative aspect-[480/638] overflow-hidden bg-[#f4f4f4]">
        <img
          src={fabric.image}
          alt={fabric.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cream/80 to-transparent" />
        <div className="absolute bottom-3 left-4 h-1 w-10 bg-maroon/90 transition-all group-hover:w-14" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug text-charcoal">{fabric.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">{fabric.description}</p>
      </div>
    </article>
  )
}
