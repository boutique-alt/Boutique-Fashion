import { useMemo, useState } from 'react'
/* eslint-disable react-refresh/only-export-components */
import { SlidersHorizontal } from 'lucide-react'
import type { Product } from '../../data/products'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name'

interface CategoryToolbarProps {
  total: number
  onSortChange: (sort: SortOption) => void
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return list
  }
}

export default function CategoryToolbar({ total, onSortChange }: CategoryToolbarProps) {
  const [sort, setSort] = useState<SortOption>('default')

  const handleSort = (value: SortOption) => {
    setSort(value)
    onSortChange(value)
  }

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-accent pb-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-charcoal/60">
        Showing all <span className="font-medium text-charcoal">{total}</span> results
      </p>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 border border-accent px-4 py-2 text-xs tracking-wide text-charcoal/70 uppercase transition-colors hover:border-maroon hover:text-maroon">
          <SlidersHorizontal size={14} />
          Filter
        </button>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="border border-accent bg-cream px-4 py-2 text-xs tracking-wide text-charcoal/70 uppercase focus:border-maroon focus:outline-none"
        >
          <option value="default">Default sorting</option>
          <option value="price-asc">Sort by price: low to high</option>
          <option value="price-desc">Sort by price: high to low</option>
          <option value="name">Sort by name</option>
        </select>
      </div>
    </div>
  )
}

export function useSortedProducts(products: Product[]) {
  const [sort, setSort] = useState<SortOption>('default')
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])
  return { sorted, setSort }
}
