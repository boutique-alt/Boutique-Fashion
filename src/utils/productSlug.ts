export function slugFromHref(href?: string): string {
  if (!href) return ''
  try {
    const url = new URL(href, 'http://localhost')
    const parts = url.pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('product')
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
    return parts[parts.length - 1] ?? ''
  } catch {
    return ''
  }
}

export function productPath(slug: string): string {
  return `/product/${slug}`
}

export function adminProductPreviewPath(slug: string): string {
  return `/admin/products/preview/${slug}`
}
