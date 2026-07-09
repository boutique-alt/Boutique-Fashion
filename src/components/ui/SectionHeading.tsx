interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="font-serif text-3xl font-normal uppercase tracking-widest text-maroon md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-sans text-[11px] tracking-[0.2em] text-charcoal/70 uppercase">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-px w-16 bg-gold ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  )
}
