import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Plus, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { isSupabaseConfigured } from '../../config/env'
import AdminProductCard from '../../components/admin/AdminProductCard'
import ProductForm from '../../components/admin/ProductForm'
import BulkUploadModal from '../../components/admin/BulkUploadModal'
import CategoryToolbar, { useSortedProducts } from '../../components/shop/CategoryToolbar'
import { type ProductDetail, getProductCode, getProductForEdit, mapAdminProductToDetail } from '../../data/productCatalog'
import { useProductCatalog } from '../../hooks/useProductCatalog'
import {
  createAdminProduct,
  deleteAdminProduct,
  deleteStaticProduct,
  saveStaticProductOverride,
  fetchProductDetails,
  loadAdminProductForEdit,
  getLastCatalogHydrationError,
  stripShopCategoriesFromOthers,
  updateAdminProduct,
} from '../../services/productService'
import type { AdminProductInput } from '../../types/adminProduct'

const PAGE_SIZE = 24

export default function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  
  const { products, version } = useProductCatalog()
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [editing, setEditing] = useState<ProductDetail | null>(null)
  const [adding, setAdding] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [catalogWarning, setCatalogWarning] = useState('')
  const [page, setPage] = useState(1)
  const [showBulkModal, setShowBulkModal] = useState(false)

  // Keep query in sync with URL if search changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setPage(1)
    if (val.trim()) {
      setSearchParams({ search: val.trim() }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  // Filter products by SKU or Name
  const filteredProducts = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase()
    if (!raw) return products as ProductDetail[]

    const rawClean = raw.replace(/\s+/g, '').replace(/^productcode:/, '').replace(/^sku-?/, '')

    return (products as ProductDetail[]).filter((p) => {
      const code = getProductCode(p).toLowerCase()
      const codeClean = code.replace(/\s+/g, '').replace(/^sku-?/, '')
      const idClean = p.id.toString().toLowerCase().replace(/\s+/g, '')

      const matchesCode =
        code.includes(raw) ||
        (rawClean.length > 0 && codeClean.includes(rawClean)) ||
        (rawClean.length > 0 && rawClean.includes(codeClean)) ||
        (rawClean.length >= 2 && idClean.includes(rawClean))

      const matchesText =
        p.name.toLowerCase().includes(raw) ||
        p.categoryLabel.toLowerCase().includes(raw)

      return matchesCode || matchesText
    })
  }, [products, searchQuery])
  
  const { sorted, setSort } = useSortedProducts(filteredProducts)

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

  const handleEdit = async (product: ProductDetail) => {
    setSaveError('')

    if (product.source === 'admin') {
      const fresh = await loadAdminProductForEdit(product.slug)
      if (fresh) {
        setEditing(getProductForEdit(product.slug) ?? mapAdminProductToDetail(fresh))
        setAdding(false)
        return
      }
      await fetchProductDetails(product.slug)
    }

    setEditing(getProductForEdit(product.slug) ?? product)
    setAdding(false)
  }

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
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginatedProducts = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-full">
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
        <div className="flex items-center gap-4">
          {!showForm && (
            <>
              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 border border-accent px-5 py-2.5 text-xs font-medium tracking-[0.15em] text-charcoal uppercase hover:border-maroon hover:text-maroon"
              >
                Bulk Upload
              </button>
              <button
                type="button"
                onClick={() => { setSaveError(''); setAdding(true) }}
                className="flex items-center gap-2 bg-maroon px-5 py-2.5 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light"
              >
                <Plus size={14} />
                Add Product
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by Product Code (SKU) or Name..."
            className="w-full bg-cream/50 border border-accent pl-10 pr-9 py-2.5 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-maroon focus:bg-cream transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal p-0.5"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="text-xs text-charcoal/70 flex items-center gap-1.5 self-center">
            Found <span className="font-semibold text-maroon">{filteredProducts.length}</span> matching product{filteredProducts.length === 1 ? '' : 's'}
          </div>
        )}
      </div>

      <CategoryToolbar total={filteredProducts.length} onSortChange={(sort) => { setSort(sort); setPage(1); }} />

      {paginatedProducts.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center text-center p-8 border border-dashed border-accent/60 bg-cream/30">
          <p className="font-serif text-lg text-charcoal mb-2">No products found</p>
          <p className="text-xs text-charcoal/60 mb-4">
            No product matches code or name "{searchQuery}". Check the code and try again.
          </p>
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="text-xs uppercase font-medium tracking-wider text-maroon hover:underline"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 flex-1 content-start">
          {paginatedProducts.map((product) => (
            <AdminProductCard
              key={(product as ProductDetail).slug}
              product={product as ProductDetail}
              onEdit={() => void handleEdit(product as ProductDetail)}
              onDelete={() => handleDelete(product as ProductDetail)}
            />
          ))}
        </div>
      )}

      {/* Pagination Bottom */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-accent bg-cream disabled:opacity-50 hover:bg-cream-dark transition-colors"
          >
            <ChevronLeft size={16} className="text-charcoal" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[32px] h-8 px-2 flex items-center justify-center text-sm font-mono border ${
                p === page ? 'border-maroon bg-maroon text-cream' : 'border-accent bg-cream text-charcoal hover:bg-cream-dark'
              } transition-colors`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 border border-accent bg-cream disabled:opacity-50 hover:bg-cream-dark transition-colors"
          >
            <ChevronRight size={16} className="text-charcoal" />
          </button>
        </div>
      )}

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

      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            // Data refreshes via catalog listener in the background
          }}
        />
      )}
    </div>
  )
}
