import { useState } from 'react'
import type { ProductDetail } from '../../data/productCatalog'

interface ProductTabsProps {
  product: ProductDetail
}

const tabs = ['Description', 'Additional information', 'Reviews'] as const

export default function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<typeof tabs[number]>('Description')

  return (
    <div className="mt-16 border-t border-accent pt-10">
      <div className="flex gap-6 border-b border-accent">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
              active === tab
                ? 'border-b-2 border-maroon text-maroon'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === 'Description' && (
          <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-charcoal/70">
            {product.description.split('\n\n').map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
            {product.fabric && (
              <div className="mt-6">
                <p className="mb-2 font-medium text-charcoal">Fabric</p>
                <p>{product.fabric}</p>
              </div>
            )}
            {product.washCare && (
              <div className="mt-4">
                <p className="mb-2 font-medium text-charcoal">Wash Care Instructions</p>
                <ul className="list-inside list-disc space-y-1">
                  {product.washCare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {active === 'Additional information' && (
          <table className="text-sm text-charcoal/70">
            <tbody>
              <tr className="border-b border-accent">
                <td className="py-3 pr-8 font-medium text-charcoal">Size</td>
                <td className="py-3">{product.sizes.join(', ')}</td>
              </tr>
              <tr className="border-b border-accent">
                <td className="py-3 pr-8 font-medium text-charcoal">Category</td>
                <td className="py-3">{product.categoryLabel}</td>
              </tr>
            </tbody>
          </table>
        )}

        {active === 'Reviews' && (
          <div className="max-w-xl">
            <p className="text-sm text-charcoal/60">There are no reviews yet.</p>
            <p className="mt-2 text-sm text-charcoal/50">
              Be the first to review &ldquo;{product.name}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
