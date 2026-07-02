export interface ProductAddon {
  id: string
  label: string        // e.g. "Add Pant", "Add Dupatta"
  description: string  // e.g. "Chanderi pant"
  price: number
  optional: boolean    // if true shown as checkbox; if false always included
}

export interface AdminProductInput {
  name: string
  price: number
  originalPrice?: number
  image: string
  categorySlug: string
  sizes: string[]
  shortDescription: string
  description: string
  onSale?: boolean
  isNew?: boolean
  fabric?: string
  washCare?: string[]
  productDetails?: Record<string, string>   // e.g. { Material: 'Chanderi', Craft: 'Embroidered' }
  addons?: ProductAddon[]
  sku?: string
}

export interface AdminProduct extends AdminProductInput {
  id: string
  slug: string
  categoryLabel: string
  categoryPath: string
  createdAt: string
  updatedAt: string
}

export interface ProductOverride extends Partial<AdminProductInput> {
  name?: string
  price?: number
}
