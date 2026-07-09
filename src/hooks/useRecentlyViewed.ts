import { useState, useEffect } from 'react'

const STORAGE_KEY = 'bootiq_recently_viewed'
const MAX_ITEMS = 4

export function useRecentlyViewed(currentProductSlug?: string) {
  const [viewedSlugs, setViewedSlugs] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let slugs: string[] = stored ? JSON.parse(stored) : []

      if (currentProductSlug) {
        // Remove the current slug if it exists so we can move it to the front
        slugs = slugs.filter((slug) => slug !== currentProductSlug)
        slugs.unshift(currentProductSlug)
        // Keep only the most recent MAX_ITEMS
        slugs = slugs.slice(0, MAX_ITEMS + 1) // +1 because we'll filter out current slug in the UI
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
      }

      setViewedSlugs(slugs)
    } catch (e) {
      console.warn('Could not manage recently viewed items', e)
    }
  }, [currentProductSlug])

  return viewedSlugs
}
