import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '../../data/products'
import { slugFromHref, productPath } from '../../utils/productSlug'
import WishlistButton from '../wishlist/WishlistButton'

interface ProductCardProps {
  product: Product & { slug?: string }
}

export default function ProductCard({ product }: ProductCardProps) {
  const slug = product.slug ?? slugFromHref(product.href)
  const to = slug ? productPath(slug) : '#'

  const discount =
    product.onSale && product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  return (
    <div className="group relative">
      <Link to={to} className="block">
        <div className="relative aspect-[480/638] overflow-hidden bg-[#f4f4f4]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute left-2 top-2 bg-charcoal px-2 py-0.5 text-[9px] font-medium tracking-widest text-cream uppercase">
              New
            </span>
          )}
          {product.onSale && discount && (
            <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 text-[9px] font-medium tracking-widest text-cream uppercase">
              -{discount}%
            </span>
          )}
          <span className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-charcoal opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <div className="mt-3 space-y-1.5 px-0.5">
          <h3 className="font-sans text-[13px] leading-snug text-charcoal/85 line-clamp-2 transition-colors group-hover:text-maroon">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-[13px] text-charcoal">
              MRP. {product.price.toLocaleString('en-IN')} INR
            </p>
            {product.originalPrice && (
              <p className="text-[11px] text-charcoal/40 line-through">
                MRP. {product.originalPrice.toLocaleString('en-IN')} INR
              </p>
            )}
          </div>
        </div>
      </Link>
      {slug && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-cream/90 p-1.5 shadow-sm">
          <WishlistButton slug={slug} />
        </div>
      )}
    </div>
  )
}
