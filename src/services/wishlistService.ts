import { getSupabase } from '../lib/supabase'

export async function fetchUserWishlist(userId: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from('user_wishlists')
    .select('product_slugs')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) return []
  return data.product_slugs ?? []
}

export async function saveUserWishlist(userId: string, productSlugs: string[]): Promise<void> {
  const { error } = await getSupabase()
    .from('user_wishlists')
    .upsert({
      user_id: userId,
      product_slugs: productSlugs,
      updated_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message)
}
