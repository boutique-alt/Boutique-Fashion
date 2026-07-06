import { useEffect, useState } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { isSupabaseConfigured } from '../../config/env'
import AdminProductCard from '../../components/admin/AdminProductCard'
import ProductForm from '../../components/admin/ProductForm'
import CategoryToolbar, { useSortedProducts } from '../../components/shop/CategoryToolbar'
import { type ProductDetail } from '../../data/productCatalog'
import { useProductCatalog } from '../../hooks/useProductCatalog'
import {
  createAdminProduct,
  deleteAdminProduct,
  deleteStaticProduct,
  saveStaticProductOverride,
  getLastCatalogHydrationError,
  stripShopCategoriesFromOthers,
  updateAdminProduct,
} from '../../services/productService'
import type { AdminProductInput } from '../../types/adminProduct'

export default function AdminProductsPage() {
  const { products, version } = useProductCatalog()
  const [editing, setEditing] = useState<ProductDetail | null>(null)
  const [adding, setAdding] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [catalogWarning, setCatalogWarning] = useState('')
  const { sorted, setSort } = useSortedProducts(products as ProductDetail[])

  useEffect(() => {
    const hydrationError = getLastCatalogHydrationError()
    if (hydrationError) {
      setCatalogWarning(hydrationError)
      return
    }
    if (!isSupabaseConfigured()) {
      setCatalogWarning(
        'Supabase is not configured on this deployment. Only built-in products are shown. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel, then redeploy.',
      )
      return
    }
    const adminCount = products.filter((p) => (p as ProductDetail).source === 'admin').length
    if (adminCount === 0 && products.length < 100) {
      setCatalogWarning(
        'Cloud products did not load — only built-in catalog is visible. Check Vercel environment variables and redeploy.',
      )
      return
    }
    setCatalogWarning('')
  }, [products, version])

  const handleSave = async (input: AdminProductInput) => {
    try {
      setSaveError('')
      const selections = input.shopCategorySelections ?? []
      const owner = editing
        ? { slug: editing.slug, adminId: editing.adminId }
        : { slug: '', adminId: undefined }

      if (selections.length > 0) {
        await stripShopCategoriesFromOthers(owner, selections)
      }

      if (editing) {
        if (editing.source === 'admin' && editing.adminId) {
          await updateAdminProduct(editing.adminId, input)
        } else {
          await saveStaticProductOverride(editing.slug, input)
        }
      } else {
        await createAdminProduct(input)
      }
      setEditing(null)
      setAdding(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save product')
    }
  }

  const handleDelete = async (product: ProductDetail) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    if (product.source === 'admin' && product.adminId) {
      await deleteAdminProduct(product.adminId)
    } else {
      await deleteStaticProduct(product.slug)
    }
    if (editing?.slug === product.slug) setEditing(null)
  }

  const showForm = adding || editing

  return (
    <div className="p-6 md:p-8">
      {catalogWarning && (
        <div className="mb-6 flex items-start gap-3 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold" />
          <p>{catalogWarning}</p>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Same view as your shop — edit or delete from each card
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => { setSaveError(''); setAdding(true) }}
            className="flex items-center gap-2 bg-maroon px-5 py-2.5 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light"
          >
            <Plus size={14} />
            Add Product
          </button>
        )}
      </div>

      <CategoryToolbar total={products.length} onSortChange={setSort} />

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {sorted.map((product) => (
          <AdminProductCard
            key={(product as ProductDetail).slug}
            product={product as ProductDetail}
            onEdit={() => { setSaveError(''); setEditing(product as ProductDetail); setAdding(false) }}
            onDelete={() => handleDelete(product as ProductDetail)}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <button
              type="button"
              onClick={() => { setAdding(false); setEditing(null) }}
              className="absolute right-3 top-3 z-10 rounded-full bg-cream p-1.5 text-charcoal shadow-sm hover:text-maroon"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <ProductForm
              product={editing ?? undefined}
              onSave={handleSave}
              onCancel={() => { setAdding(false); setEditing(null); setSaveError('') }}
              error={saveError}
            />
          </div>
        </div>
      )}
    </div>
  )
}
