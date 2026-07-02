import type { ProductDetail } from '../../data/productCatalog'

interface ProductTabsProps {
  product: ProductDetail
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <div className="mt-14 border-t border-accent/60 pt-10">
      <h2 className="mb-5 font-serif text-xl font-medium text-charcoal">Product Description</h2>
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-charcoal/70">
        {product.description.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  )
}
