import { useEffect, useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProductDetail } from '../../data/productCatalog'
import type { AdminProductInput, ProductAddon } from '../../types/adminProduct'
import { adminCategoryOptions } from '../../services/productService'
import { shopCategoryCheckboxOptions } from '../../data/shopCategories'
import { getShopCategoryConfig } from '../../services/shopCategoryService'
import ProductImageUpload from './ProductImageUpload'
import ProductVideoUpload from './ProductVideoUpload'

interface ProductFormProps {
  product?: ProductDetail
  onSave: (input: AdminProductInput) => void
  onCancel: () => void
  error?: string
}

const defaultDetailKeys = [
  'Material',
  'Design Pattern',
  'Occasion',
  'Length',
  'Neckline',
  'Sleeve Length'
]

const emptyForm: AdminProductInput = {
  name: '',
  price: 0,
  image: '',
  categorySlug: adminCategoryOptions[0]?.slug ?? 'one-piece',
  sizes: ['M', 'L', 'XL', '2XL'],
  shortDescription: '',
  description: '',
  sku: '',
  fabric: '',
  productDetails: {},
  addons: [],
}

const inputClass =
  'w-full border border-accent bg-cream px-3 py-2 text-sm outline-none focus:border-maroon'

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function ProductForm({ product, onSave, onCancel, error }: ProductFormProps) {
  const [form, setForm] = useState<AdminProductInput>(emptyForm)
  const [sizesText, setSizesText] = useState('M, L, XL, 2XL')
  const [addons, setAddons] = useState<ProductAddon[]>([])
  const [shopCategoryChecks, setShopCategoryChecks] = useState<Record<string, boolean>>({})

  // Predefined Product Details state
  const [details, setDetails] = useState<Record<string, string>>({
    'Material': '',
    'Design Pattern': '',
    'Occasion': '',
    'Length': '',
    'Neckline': '',
    'Sleeve Length': ''
  })

  // Section collapse states
  const [showDetails, setShowDetails] = useState(false)
  const [showAddons, setShowAddons] = useState(false)

  useEffect(() => {
    if (product) {
      const config = getShopCategoryConfig()
      const checks = Object.fromEntries(
        shopCategoryCheckboxOptions.map((c) => [c.id, config[c.id]?.image === product.image]),
      )
      setShopCategoryChecks(checks)
      setForm({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        categorySlug: product.categorySlug,
        sizes: product.sizes,
        sku: product.sku ?? '',
        shortDescription: product.shortDescription ?? '',
        description: product.description,
        onSale: product.onSale,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        newArrivalVideo: product.newArrivalVideo,
        fabric: product.fabric ?? '',
        productDetails: product.productDetails ?? {},
        addons: product.addons ?? [],
      })
      setSizesText(product.sizes.join(', '))
      setAddons(product.addons ?? [])
      
      const pDetails = product.productDetails ?? {}
      const initialDetails: Record<string, string> = {}
      defaultDetailKeys.forEach((key) => {
        initialDetails[key] = pDetails[key] ?? ''
      })
      setDetails(initialDetails)
    } else {
      setShopCategoryChecks(
        Object.fromEntries(shopCategoryCheckboxOptions.map((c) => [c.id, false])),
      )
      setForm(emptyForm)
      setSizesText('M, L, XL, 2XL')
      setAddons([])
      setDetails({
        'Material': '',
        'Design Pattern': '',
        'Occasion': '',
        'Length': '',
        'Neckline': '',
        'Sleeve Length': ''
      })
    }
  }, [product])

  const handleChange = (field: keyof AdminProductInput, value: string | number | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'isNew' && !value) {
        next.newArrivalVideo = undefined
      }
      return next
    })
  }

  /* ── Addon helpers ── */
  const addAddon = () => {
    setAddons((prev) => [
      ...prev,
      { id: genId(), label: '', description: '', price: 0, optional: true },
    ])
  }

  const updateAddon = (id: string, field: keyof ProductAddon, value: string | number | boolean) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
  }

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDetailChange = (key: string, val: string) => {
    setDetails((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) return

    const sizes = sizesText.split(',').map((s) => s.trim()).filter(Boolean)
    const productDetails: Record<string, string> = {}
    defaultDetailKeys.forEach((key) => {
      const val = details[key]?.trim()
      if (val) {
        productDetails[key] = val
      }
    })

    onSave({
      ...form,
      sizes: sizes.length ? sizes : ['M', 'L', 'XL', '2XL'],
      originalPrice: form.originalPrice || undefined,
      fabric: form.fabric?.trim() || undefined,
      newArrivalVideo: form.newArrivalVideo?.trim() || undefined,
      productDetails: Object.keys(productDetails).length ? productDetails : undefined,
      addons: addons.length ? addons : undefined,
      shopCategorySelections: shopCategoryCheckboxOptions
        .map((c) => c.id)
        .filter((id) => shopCategoryChecks[id]),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="border border-accent bg-cream p-6">
      <h2 className="mb-6 font-serif text-lg text-charcoal">
        {product ? 'Edit Product' : 'Add Product'}
      </h2>

      {/* ── Basic Fields ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Name *</label>
          <input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Price (₹) *</label>
          <input required type="number" min={0} value={form.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">MRP / Original (optional)</label>
          <input type="number" min={0} value={form.originalPrice ?? ''} onChange={(e) => handleChange('originalPrice', e.target.value ? Number(e.target.value) : 0)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <ProductImageUpload value={form.image} onChange={(url) => handleChange('image', url)} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Category *</label>
          <select value={form.categorySlug} onChange={(e) => handleChange('categorySlug', e.target.value)} className={inputClass}>
            {adminCategoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Sizes (comma-separated)</label>
          <input value={sizesText} onChange={(e) => setSizesText(e.target.value)} className={inputClass} placeholder="M, L, XL, 2XL" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Product Code (SKU)</label>
          <input value={form.sku || ''} onChange={(e) => handleChange('sku', e.target.value)} className={inputClass} placeholder="e.g. SK-1002" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={`${inputClass} resize-none`} />
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={Boolean(form.onSale)} onChange={(e) => handleChange('onSale', e.target.checked)} className="accent-maroon" />
          On Sale
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={Boolean(form.isBestSeller)} onChange={(e) => handleChange('isBestSeller', e.target.checked)} className="accent-maroon" />
          Best Seller
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input type="checkbox" checked={Boolean(form.isNew)} onChange={(e) => handleChange('isNew', e.target.checked)} className="accent-maroon" />
          New Arrival
        </label>
        {shopCategoryCheckboxOptions.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm text-charcoal/70">
            <input
              type="checkbox"
              checked={Boolean(shopCategoryChecks[option.id])}
              onChange={(e) =>
                setShopCategoryChecks((prev) => ({ ...prev, [option.id]: e.target.checked }))
              }
              className="accent-maroon"
            />
            {option.label}
          </label>
        ))}
        {form.isNew && (
          <div className="sm:col-span-2">
            <ProductVideoUpload
              value={form.newArrivalVideo ?? ''}
              onChange={(url) => handleChange('newArrivalVideo', url)}
            />
          </div>
        )}
      </div>

      {/* ── Product Details (Predefined fields) ── */}
      <div className="mt-6 border border-accent/60 rounded">
        <button type="button" onClick={() => setShowDetails((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-charcoal">
          Product Details
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showDetails && (
          <div className="border-t border-accent/60 px-4 py-4 space-y-4">
            <p className="text-xs text-charcoal/50 font-light">Fill in the values for the following standard product specifications:</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {defaultDetailKeys.map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-[11px] font-semibold text-charcoal/60 uppercase tracking-wider">{key}</label>
                  <input
                    value={details[key] || ''}
                    onChange={(e) => handleDetailChange(key, e.target.value)}
                    className={inputClass}
                    placeholder={`e.g. Enter ${key}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* ── Add-ons ── */}
      <div className="mt-3 border border-accent/60 rounded">
        <button type="button" onClick={() => setShowAddons((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-charcoal">
          Add-ons (Pant, Dupatta, etc.)
          {showAddons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showAddons && (
          <div className="border-t border-accent/60 px-4 py-4 space-y-4">
            <p className="text-xs text-charcoal/50">Add purchasable extras shown on the product page. Mark as optional to show a checkbox.</p>
            {addons.map((addon) => (
              <div key={addon.id} className="rounded border border-accent/60 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wide">Add-on</span>
                  <button type="button" onClick={() => removeAddon(addon.id)} className="text-charcoal/40 hover:text-maroon">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-charcoal/60 uppercase">Label *</label>
                    <input value={addon.label} onChange={(e) => updateAddon(addon.id, 'label', e.target.value)} className={inputClass} placeholder="e.g. Add Pant" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-charcoal/60 uppercase">Price (₹) *</label>
                    <input type="number" min={0} value={addon.price || ''} onChange={(e) => updateAddon(addon.id, 'price', Number(e.target.value))} className={inputClass} placeholder="e.g. 1199" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-charcoal/60 uppercase">Description</label>
                    <input value={addon.description} onChange={(e) => updateAddon(addon.id, 'description', e.target.value)} className={inputClass} placeholder="e.g. Chanderi pant" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-charcoal/70 sm:col-span-2">
                    <input type="checkbox" checked={addon.optional} onChange={(e) => updateAddon(addon.id, 'optional', e.target.checked)} className="accent-maroon" />
                    Optional (show as checkbox; uncheck = always included)
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={addAddon} className="flex items-center gap-1 text-xs font-semibold text-maroon hover:underline">
              <Plus size={13} /> Add New Add-on
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-gold">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={!form.image} className="bg-maroon px-6 py-2.5 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light disabled:opacity-60">
          Save
        </button>
        <button type="button" onClick={onCancel} className="border border-accent px-6 py-2.5 text-xs font-medium tracking-[0.15em] text-charcoal uppercase hover:border-maroon hover:text-maroon">
          Cancel
        </button>
      </div>
    </form>
  )
}
