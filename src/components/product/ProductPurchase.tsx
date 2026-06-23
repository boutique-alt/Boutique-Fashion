import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import type { ProductDetail } from '../../data/productCatalog'
import { useStore } from '../../context/StoreContext'
import WishlistButton from '../wishlist/WishlistButton'

interface ProductPurchaseProps {
  product: ProductDetail
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const [size, setSize] = useState(product.sizes[0] ?? 'M')
  const [qty, setQty] = useState(1)
  const { addToCart } = useStore()
  const navigate = useNavigate()

  const discount =
    product.onSale && product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
      quantity: qty,
    })
  }

  const handleBuyNow = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
      quantity: qty,
    })
    navigate('/checkout')
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-2xl font-medium leading-snug text-charcoal md:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        <WishlistButton slug={product.slug} className="mt-2 shrink-0" />
      </div>
      <p className="mt-2 text-xs text-charcoal/50">0 customer reviews</p>

      <div className="mt-5 flex items-center gap-3">
        <p className="font-serif text-2xl text-charcoal">₹{product.price.toLocaleString('en-IN')}.00</p>
        {product.originalPrice && (
          <p className="text-sm text-charcoal/40 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}.00
          </p>
        )}
        {discount && (
          <span className="bg-gold px-2 py-0.5 text-[10px] font-medium tracking-widest text-cream uppercase">
            -{discount}%
          </span>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-charcoal/70">{product.shortDescription}</p>

      <div className="mt-8">
        <p className="mb-3 text-xs font-medium tracking-[0.15em] text-charcoal uppercase">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`min-w-[3rem] border px-4 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                size === s
                  ? 'border-maroon bg-maroon text-cream'
                  : 'border-accent text-charcoal/70 hover:border-maroon hover:text-maroon'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-[0.15em] text-charcoal uppercase">Quantity</p>
        <div className="inline-flex items-center border border-accent">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-charcoal/60 transition-colors hover:text-maroon"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-[3rem] border-x border-accent px-4 py-2.5 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-2.5 text-charcoal/60 transition-colors hover:text-maroon"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 bg-maroon px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
        >
          <ShoppingBag size={16} />
          Add to cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 border border-charcoal px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-charcoal uppercase transition-colors hover:bg-charcoal hover:text-cream"
        >
          Buy Now
        </button>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 border-t border-accent pt-8">
        {[
          { title: 'Free', sub: 'Shipping' },
          { title: '100%', sub: 'Guaranteed Satisfaction' },
          { title: '7 Days', sub: 'Money Back Guarantee' },
        ].map((item) => (
          <div key={item.sub} className="text-center">
            <p className="font-serif text-lg text-maroon">{item.title}</p>
            <p className="mt-1 text-[10px] leading-snug tracking-wide text-charcoal/60 uppercase">{item.sub}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-charcoal/50">
        Category: <span className="text-charcoal/70">{product.categoryLabel}</span>
      </p>
    </div>
  )
}
