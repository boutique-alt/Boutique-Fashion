import type { ProductViewStat } from '../../../types/analytics'

interface AnalyticsProductViewsProps {
  products: ProductViewStat[]
}

export default function AnalyticsProductViews({ products }: AnalyticsProductViewsProps) {
  return (
    <div className="rounded-xl border border-accent/60 bg-cream p-6 shadow-sm">
      <h2 className="font-serif text-xl font-semibold text-charcoal">Product Views</h2>
      <p className="mt-1 text-sm text-charcoal/50">Most viewed products in selected period</p>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-sm text-charcoal/50">No product views recorded yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-accent text-left text-xs tracking-wide text-charcoal/50 uppercase">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.slug} className="border-b border-accent/50">
                  <td className="py-3 pr-4 text-charcoal/40">{i + 1}</td>
                  <td className="py-3 pr-4 text-charcoal">{p.name}</td>
                  <td className="py-3 text-right font-medium text-maroon">{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
