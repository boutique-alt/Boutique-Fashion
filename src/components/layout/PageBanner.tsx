import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageBannerProps {
  title: string
  breadcrumbs: Breadcrumb[]
  image?: string
}

export default function PageBanner({ title, breadcrumbs, image }: PageBannerProps) {
  return (
    <section className="relative flex h-48 items-center justify-center overflow-hidden bg-charcoal md:h-56">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal/80" />
        </>
      )}
      <div className="relative z-10 px-4 text-center">
        <nav className="mb-3 flex items-center justify-center gap-1 text-[10px] tracking-[0.2em] text-cream/60 uppercase">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} />}
              {crumb.href ? (
                <Link to={crumb.href} className="transition-colors hover:text-gold">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-cream/90">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-serif text-3xl font-medium tracking-wide text-cream md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-px w-12 bg-gold" />
      </div>
    </section>
  )
}
