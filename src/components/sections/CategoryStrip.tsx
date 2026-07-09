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
    <div className="w-full border-b border-charcoal/10 bg-transparent">
      {/* Top Tabs */}
      <div className="mx-auto flex max-w-7xl gap-8 px-8 pt-3 md:justify-center">
        {['WOMEN', 'MEN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'WOMEN' | 'MEN')}
            className={`font-sans text-[11px] font-medium tracking-widest transition-colors ${
              activeTab === tab
                ? 'text-charcoal border-b-2 border-maroon pb-1'
                : 'text-charcoal/40 pb-1 hover:text-charcoal/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Circle Categories */}
      <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 py-4 scrollbar-hide md:justify-center md:px-6">
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
              <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-[#f4f4f4] shadow-sm transition-transform group-hover:scale-105">
                <img
                  src={getDefaultCategoryImage(cat)}
                  alt={cat.title}
                  className="h-full w-full scale-[1.2] object-cover object-top"
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
