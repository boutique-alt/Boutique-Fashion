import { describe, it, expect } from 'vitest'
import { slugFromHref, productPath, adminProductPreviewPath } from './productSlug'

describe('productSlug utils', () => {
  it('slugFromHref extracts slug from full product url', () => {
    expect(slugFromHref('https://example.com/product/floral-dress')).toBe('floral-dress')
  })

  it('slugFromHref extracts slug from partial path', () => {
    expect(slugFromHref('/product/floral-dress')).toBe('floral-dress')
  })

  it('productPath returns the correct path', () => {
    expect(productPath('floral-dress')).toBe('/product/floral-dress')
  })

  it('adminProductPreviewPath returns the correct path', () => {
    expect(adminProductPreviewPath('floral-dress')).toBe('/admin/products/preview/floral-dress')
  })
})
