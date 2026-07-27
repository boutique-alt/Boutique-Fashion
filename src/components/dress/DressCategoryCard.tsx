import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { CategoryConfig } from '../../data/categories'

interface DressCategoryCardProps {
  category: CategoryConfig
}

export default function DressCategoryCard({ category }: DressCategoryCardProps) {
  const image = category.products[0]?.image

  return (
    <Link
      to={`/dress/${category.slug}`}
      className="group flex flex-col overflow-hidden border border-accent/70 bg-cream transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark/30">
        {image ? (
          <img
            src={image}
            alt={category.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-cream-dark/40 text-sm text-charcoal/40">
            No preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-sm bg-cream/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-maroon">
          {category.count} items
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-serif text-xl font-medium text-charcoal md:text-2xl">{category.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">{category.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors group-hover:text-maroon-light">
          Shop Collection
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
