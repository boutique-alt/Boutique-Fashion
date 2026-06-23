interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="font-serif text-3xl font-medium tracking-wide text-charcoal md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 font-sans text-sm tracking-widest text-charcoal/60 uppercase">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-px w-16 bg-gold ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  )
}
