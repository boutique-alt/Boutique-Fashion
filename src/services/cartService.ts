import type { CartItem } from '../context/StoreContext'
import { getSupabase } from '../lib/supabase'

export async function fetchUserCart(userId: string): Promise<CartItem[]> {
  const { data, error } = await getSupabase()
    .from('user_carts')
    .select('items')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) return []
  return (data.items as CartItem[]) ?? []
}

export async function saveUserCart(userId: string, items: CartItem[]): Promise<void> {
  const { error } = await getSupabase()
    .from('user_carts')
    .upsert({
      user_id: userId,
      items,
      updated_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message)
}
