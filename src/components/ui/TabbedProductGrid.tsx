import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import type { Product } from '../../data/products'

interface TabbedProductGridProps {
  tabs: string[]
  productsByTab: Record<string, Product[]>
  title?: string
  subtitle?: string
  limit?: number
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function TabbedProductGrid({ 
  tabs, 
  productsByTab, 
  title, 
  subtitle, 
  limit,
  activeTab: controlledActiveTab,
  onTabChange
}: TabbedProductGridProps) {
  const [localActiveTab, setLocalActiveTab] = useState(tabs[0])
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab
  const setActiveTab = onTabChange !== undefined ? onTabChange : setLocalActiveTab

  let products = productsByTab[activeTab] ?? productsByTab[tabs[0]] ?? []
  if (limit) {
    products = products.slice(0, limit)
  }

  return (
    <div>
      {title && (
        <div className="mb-8 text-center">
          {subtitle && (
            <p className="mb-2 text-[10px] font-medium tracking-[0.35em] text-charcoal/50 uppercase md:text-xs">
              {subtitle}
            </p>
          )}
          <h2 className="font-serif text-2xl font-medium tracking-wide text-charcoal md:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>
      )}
      <div className="mb-8 flex flex-wrap items-center justify-center">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-sans text-[10px] font-medium tracking-[0.2em] uppercase transition-colors md:px-5 md:text-xs ${
              activeTab === tab ? 'text-maroon' : 'text-charcoal/45 hover:text-charcoal'
            } ${i < tabs.length - 1 ? 'border-r border-accent' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
