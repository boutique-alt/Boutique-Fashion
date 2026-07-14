import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '../lib/supabase'
import { mapProduct } from '../lib/supabaseMappers'
import type { AdminProduct } from '../types/adminProduct'
import { getDeletedSlugs, getProductOverrides } from '../services/productService'

export interface UseProductsOptions {
  categorySlug?: string
  shopCategory?: string
  isBestSeller?: boolean
  isNew?: boolean
  limit?: number
  searchQuery?: string
  sortBy?: 'newest' | 'price-asc' | 'price-desc'
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)

  // Use a stringified version of options as a dependency to detect changes
  const optionsKey = JSON.stringify(options)

  const fetchProducts = useCallback(
    async (pageIndex: number, isLoadMore = false) => {
      setLoading(true)
      setError(null)
      try {
        const client = getSupabase()
        const pageSize = options.limit || 20
        const from = pageIndex * pageSize
        const to = from + pageSize - 1

        let query = client.from('products').select('id, slug, name, price, original_price, image, additional_images, category_slug, category_label, category_path, is_new, is_best_seller, on_sale, shop_category_selections, stock_quantity, created_at, updated_at')

        if (options.categorySlug) {
          query = query.eq('category_slug', options.categorySlug)
        }
        if (options.isBestSeller) {
          query = query.eq('is_best_seller', true)
        }
        if (options.isNew) {
          query = query.eq('is_new', true)
        }
        if (options.shopCategory) {
          query = query.contains('shop_category_selections', [options.shopCategory])
        }
        if (options.searchQuery) {
          query = query.ilike('name', `%${options.searchQuery}%`)
        }

        if (options.sortBy === 'price-asc') {
          query = query.order('price', { ascending: true })
        } else if (options.sortBy === 'price-desc') {
          query = query.order('price', { ascending: false })
        } else {
          query = query.order('created_at', { ascending: false })
        }

        query = query.range(from, to)

        const { data, error: fetchError } = await query

        if (fetchError) throw new Error(fetchError.message)

        const overrides = getProductOverrides()
        const deleted = getDeletedSlugs()

        let mapped = (data || []).map(mapProduct).map(p => {
          const override = overrides[p.slug]
          if (!override) return p
          return {
            ...p,
            ...override,
            originalPrice: override.originalPrice ?? p.originalPrice,
            additionalImages: override.additionalImages ?? p.additionalImages,
            shopCategorySelections: override.shopCategorySelections ?? p.shopCategorySelections
          }
        }).filter(p => !deleted.includes(p.slug))

        if (isLoadMore) {
          setProducts(prev => [...prev, ...mapped])
        } else {
          setProducts(mapped)
        }

        setHasMore((data?.length || 0) === pageSize)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [optionsKey]
  )

  useEffect(() => {
    setPage(0)
    void fetchProducts(0, false)
  }, [fetchProducts])

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return
    const nextPage = page + 1
    setPage(nextPage)
    void fetchProducts(nextPage, true)
  }, [hasMore, loading, page, fetchProducts])

  return { products, loading, error, hasMore, loadMore }
}
