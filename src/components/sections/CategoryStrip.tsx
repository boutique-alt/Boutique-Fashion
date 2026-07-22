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
    <div className="relative w-full z-20 bg-cream py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Container Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-charcoal/5 p-6 md:p-8 shadow-sm">
          {/* Top Tabs */}
          <div className="flex justify-center gap-10 pb-6 border-b border-charcoal/5 mb-6">
            {['WOMEN', 'MEN'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'WOMEN' | 'MEN')}
                className={`relative font-serif text-sm md:text-base font-medium tracking-[0.25em] transition-all duration-300 pb-2 ${
                  activeTab === tab
                    ? 'text-maroon'
                    : 'text-charcoal/40 hover:text-charcoal/80'
                } after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-maroon after:transition-all after:duration-300 ${activeTab === tab ? 'after:w-full' : 'hover:after:w-1/2'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Circle Categories */}
          <div className="flex items-start overflow-x-auto scrollbar-hide md:justify-center gap-6 md:gap-8 py-2">
            {/* Custom "My Feed" style icon based on reference */}
            <div className="group flex shrink-0 flex-col items-center gap-3">
              <div className="flex h-[72px] w-[72px] md:h-[80px] md:w-[80px] items-center justify-center rounded-full border-[3px] border-[#b5db90] bg-[#fff5f5] p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <span className="font-sans text-xl md:text-2xl font-bold tracking-tight text-charcoal">MY</span>
              </div>
              <span className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-charcoal/70">
                MY FEED
              </span>
            </div>

            {/* Straight Line Divider */}
            <div className="self-center h-12 w-px shrink-0 bg-charcoal/10" />

            {/* Dynamic Categories */}
            {displayedCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={cat.parent.href === '/dress' ? `/dress/${cat.slug}` : `/${cat.slug}`}
                className="group flex shrink-0 flex-col items-center gap-3"
              >
                <div className="h-[72px] w-[72px] md:h-[80px] md:w-[80px] overflow-hidden rounded-full bg-cream border border-charcoal/5 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-maroon/30 group-hover:shadow-md">
                  <img
                    src={getDefaultCategoryImage(cat)}
                    alt={cat.title}
                    className="h-full w-full scale-[1.1] object-cover object-top transition-all duration-700 group-hover:scale-115"
                    loading="lazy"
                  />
                </div>
                <span className="max-w-[90px] text-center font-serif text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 group-hover:text-maroon transition-colors duration-300">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
