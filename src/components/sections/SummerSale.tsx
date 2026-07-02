import { useState } from 'react'
import { Link } from 'react-router-dom'
import TabbedProductGrid from '../ui/TabbedProductGrid'
import { bestSellerProducts } from '../../data/products'

const tabs = ['ONE PIECE', 'KURTA SET', 'COORD SET', 'BLOUSE']

const tabRouteMap: Record<string, string> = {
  'ONE PIECE': '/dress/one-piece',
  'KURTA SET': '/dress/kurta-set',
  'COORD SET': '/dress/coord-set',
  'BLOUSE': '/dress/blouse'
}

export default function SummerSale() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <TabbedProductGrid
          subtitle="Free Shipping on All Over India"
          title="You are in Best Sellers"
          tabs={tabs}
          productsByTab={bestSellerProducts}
          limit={4}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-10 text-center">
          <Link
            to={tabRouteMap[activeTab] || "/dress"}
            className="inline-block border border-charcoal px-10 py-3 text-[10px] font-medium tracking-[0.25em] text-charcoal uppercase transition-all hover:bg-charcoal hover:text-cream md:text-xs"
          >
            Show More
          </Link>
        </div>
      </div>
    </section>
  )
}
