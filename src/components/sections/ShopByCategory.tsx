import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { categoryCards } from '../../data/products'

const routes: Record<string, string> = {
  'One Piece': '/dress/one-piece',
  'Two Piece': '/dress/two-piece',
  Blouse: '/blouse',
  "Men's": '/mens',
}

export default function ShopByCategory() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-8 text-center font-serif text-2xl font-medium tracking-wide text-charcoal md:mb-10 md:text-3xl lg:text-4xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.label}
              to={routes[cat.label] ?? '/shop'}
              className="group relative overflow-hidden bg-[#f4f4f4]"
            >
              <div className="aspect-[3/4] w-full">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/60 to-transparent px-3 pb-4 pt-10">
                <h3 className="flex items-center gap-1 font-serif text-base text-cream md:text-lg">
                  {cat.label}
                  <span className="text-xs text-cream/70">({cat.count})</span>
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
