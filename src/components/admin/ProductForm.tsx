import { useEffect, useState } from 'react'
import type { ProductDetail } from '../../data/productCatalog'
import type { AdminProductInput } from '../../types/adminProduct'
import { adminCategoryOptions } from '../../services/productService'
import ProductImageUpload from './ProductImageUpload'

interface ProductFormProps {
  product?: ProductDetail
  onSave: (input: AdminProductInput) => void
  onCancel: () => void
  error?: string
}

const emptyForm: AdminProductInput = {
  name: '',
  price: 0,
  image: '',
  categorySlug: adminCategoryOptions[0]?.slug ?? 'one-piece',
  sizes: ['M', 'L', 'XL', '2XL'],
  shortDescription: '',
  description: '',
}

const inputClass =
  'w-full border border-accent bg-cream px-3 py-2 text-sm outline-none focus:border-maroon'

export default function ProductForm({ product, onSave, onCancel, error }: ProductFormProps) {
  const [form, setForm] = useState<AdminProductInput>(emptyForm)
  const [sizesText, setSizesText] = useState('M, L, XL, 2XL')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        categorySlug: product.categorySlug,
        sizes: product.sizes,
        shortDescription: product.shortDescription,
        description: product.description,
        onSale: product.onSale,
        isNew: product.isNew,
      })
      setSizesText(product.sizes.join(', '))
    } else {
      setForm(emptyForm)
      setSizesText('M, L, XL, 2XL')
    }
  }, [product])

  const handleChange = (field: keyof AdminProductInput, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) return
    const sizes = sizesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onSave({ ...form, sizes: sizes.length ? sizes : ['M', 'L', 'XL', '2XL'], originalPrice: form.originalPrice || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="border border-accent bg-cream p-6">
      <h2 className="mb-6 font-serif text-lg text-charcoal">
        {product ? 'Edit Product' : 'Add Product'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Price (₹) *</label>
          <input
            required
            type="number"
            min={0}
            value={form.price || ''}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">MRP (optional)</label>
          <input
            type="number"
            min={0}
            value={form.originalPrice ?? ''}
            onChange={(e) => handleChange('originalPrice', e.target.value ? Number(e.target.value) : 0)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <ProductImageUpload
            value={form.image}
            onChange={(url) => handleChange('image', url)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Category *</label>
          <select
            value={form.categorySlug}
            onChange={(e) => handleChange('categorySlug', e.target.value)}
            className={inputClass}
          >
            {adminCategoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Sizes</label>
          <input
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
            className={inputClass}
            placeholder="M, L, XL, 2XL"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Short Description</label>
          <input
            value={form.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            checked={Boolean(form.onSale)}
            onChange={(e) => handleChange('onSale', e.target.checked)}
            className="accent-maroon"
          />
          On Sale
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            checked={Boolean(form.isNew)}
            onChange={(e) => handleChange('isNew', e.target.checked)}
            className="accent-maroon"
          />
          New Arrival
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-gold">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={!form.image}
          className="bg-maroon px-6 py-2.5 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-accent px-6 py-2.5 text-xs font-medium tracking-[0.15em] text-charcoal uppercase hover:border-maroon hover:text-maroon"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
