import type { PageVisit } from '../types/analytics'
import type { AdminProduct, ProductOverride } from '../types/adminProduct'
import type { ContactMessage } from '../types/contact'
import type { Order, OrderBilling, OrderStatus, PaymentMethod, PaymentStatus } from '../types/order'
import type { ReturnRequest, ReturnStatus } from '../types/return'
import type { UserAddress, UserGender, UserProfile } from '../types/user'
import type { CartItem } from '../context/StoreContext'

export interface DbProfile {
  id: string
  email: string
  name: string
  phone: string | null
  avatar_url: string | null
  gender: string | null
  voluntary_consent: boolean
  address: UserAddress | null
  created_at: string
  updated_at: string
}

export interface DbOrder {
  id: string
  user_id: string | null
  user_email: string
  items: CartItem[]
  billing: OrderBilling
  subtotal: number
  shipping: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  status: OrderStatus
  razorpay_payment_id: string | null
  razorpay_order_id: string | null
  payment_screenshot_url: string | null
  status_updated_at: string | null
  created_at: string
}

export interface DbReturn {
  id: string
  order_id: string
  user_email: string
  reason: string
  status: ReturnStatus
  status_updated_at: string | null
  created_at: string
}

export interface DbContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  message: string
  read: boolean
  created_at: string
}

export interface DbPageVisit {
  id: string
  path: string
  product_slug: string | null
  product_name: string | null
  created_at: string
}

export interface DbProduct {
  id: string
  slug: string
  name: string
  price: number
  original_price: number | null
  image: string
  category_slug: string
  category_label: string
  category_path: string
  sizes: string[]
  short_description: string
  description: string
  on_sale: boolean
  is_new: boolean
  is_best_seller: boolean
  new_arrival_video: string | null
  fabric: string | null
  wash_care: string[] | null
  product_details: Record<string, string> | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addons: any[] | null
  sku: string | null
  shop_category_selections: string[] | null
  created_at: string
  updated_at: string
}

export function mapProfile(row: DbProfile): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    gender: (row.gender as UserGender) ?? undefined,
    voluntaryConsent: row.voluntary_consent,
    address: row.address ?? undefined,
    role: 'user',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    items: row.items,
    billing: row.billing,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    razorpayPaymentId: row.razorpay_payment_id ?? undefined,
    razorpayOrderId: row.razorpay_order_id ?? undefined,
    paymentScreenshotUrl: row.payment_screenshot_url ?? undefined,
    statusUpdatedAt: row.status_updated_at ?? undefined,
    createdAt: row.created_at,
  }
}

export function mapReturn(row: DbReturn): ReturnRequest {
  return {
    id: row.id,
    orderId: row.order_id,
    email: row.user_email,
    reason: row.reason,
    status: row.status,
    statusUpdatedAt: row.status_updated_at ?? undefined,
    createdAt: row.created_at,
  }
}

export function mapContact(row: DbContactMessage): ContactMessage {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  }
}

export function mapPageVisit(row: DbPageVisit): PageVisit {
  return {
    path: row.path,
    timestamp: row.created_at,
    productSlug: row.product_slug ?? undefined,
    productName: row.product_name ?? undefined,
  }
}

export function mapProduct(row: DbProduct): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: row.image,
    categorySlug: row.category_slug,
    categoryLabel: row.category_label,
    categoryPath: row.category_path,
    sizes: row.sizes,
    shortDescription: row.short_description,
    description: row.description,
    onSale: row.on_sale,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    newArrivalVideo: row.new_arrival_video ?? undefined,
    fabric: row.fabric ?? undefined,
    washCare: row.wash_care ?? undefined,
    productDetails: row.product_details ?? undefined,
    addons: row.addons ?? undefined,
    sku: row.sku ?? undefined,
    shopCategorySelections: row.shop_category_selections ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function productToDb(input: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    price: input.price,
    original_price: input.originalPrice ?? null,
    image: input.image,
    category_slug: input.categorySlug,
    category_label: input.categoryLabel,
    category_path: input.categoryPath,
    sizes: input.sizes,
    short_description: input.shortDescription,
    description: input.description,
    on_sale: input.onSale ?? false,
    is_new: input.isNew ?? false,
    is_best_seller: input.isBestSeller ?? false,
    new_arrival_video: input.newArrivalVideo ?? null,
    fabric: input.fabric ?? null,
    wash_care: input.washCare ?? null,
    product_details: input.productDetails ?? null,
    addons: input.addons ?? null,
    sku: input.sku ?? null,
    shop_category_selections: input.shopCategorySelections ?? [],
  }
}

export function mapOverrides(rows: { slug: string; override_data: ProductOverride }[]): Record<string, ProductOverride> {
  const result: Record<string, ProductOverride> = {}
  for (const row of rows) {
    result[row.slug] = row.override_data
  }
  return result
}
