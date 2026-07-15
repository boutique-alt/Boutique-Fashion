import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allCategories } from '../../data/categories'
import { getDefaultCategoryImage } from '../../data/shopCategories'

export default function CategoryStrip() {
  const [activeTab, setActiveTab] = useState<'WOMEN' | 'MEN'>('WOMEN')

  if (allCategories.length === 0) return null

  const displayedCategories = allCategories.filter((cat) => {
    if (activeTab === 'MEN') {
      return cat.slug === 'mens' || cat.slug === 'groom'
    } else {
      return cat.slug !== 'mens' && cat.slug !== 'groom' && cat.slug !== 'fabric' // Women categories
    }
  })

  return (
    <div className="relative w-full z-10 before:absolute before:inset-0 before:bg-white/40 before:backdrop-blur-md before:-z-10 border-b border-charcoal/5">
      {/* Top Tabs */}
      <div className="mx-auto flex max-w-7xl justify-center gap-8 px-8 pt-3">
        {['WOMEN', 'MEN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'WOMEN' | 'MEN')}
            className={`relative font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.2em] transition-all duration-300 pb-2 ${
              activeTab === tab
                ? 'text-charcoal'
                : 'text-charcoal/40 hover:text-charcoal/80'
            } after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-charcoal after:transition-all after:duration-300 ${activeTab === tab ? 'after:w-full' : 'hover:after:w-1/2'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Circle Categories */}
      <div className="mx-auto flex max-w-7xl items-start overflow-x-auto px-4 py-4 scrollbar-hide md:justify-center md:px-6">
        {/* Custom "My Feed" style icon based on reference */}
        <div className="group flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-[#b5db90] bg-[#fff5f5] p-1">
            <span className="font-sans text-2xl font-bold tracking-tight text-charcoal">MY</span>
          </div>
          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-charcoal">
            MY FEED
          </span>
        </div>

        {/* Straight Line Divider */}
        <div className="mx-4 h-12 w-px shrink-0 bg-charcoal/10" />

        {/* Dynamic Categories */}
        <div className="flex gap-6 md:gap-8">
          {displayedCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <div className="h-[64px] w-[64px] md:h-[72px] md:w-[72px] overflow-hidden rounded-full bg-cream shadow-sm transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={getDefaultCategoryImage(cat)}
                  alt={cat.title}
                  className="h-full w-full scale-[1.1] object-cover object-top transition-all duration-700 group-hover:scale-[1.15]"
                  loading="lazy"
                />
              </div>
              <span className="max-w-[80px] text-center font-sans text-[9px] font-medium uppercase tracking-wider text-charcoal/80">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
