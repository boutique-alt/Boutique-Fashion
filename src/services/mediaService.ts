import { isAdminLoggedIn } from './adminService'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'

export interface MediaItem {
  id: string
  url: string
  filename: string
  size_bytes: number | null
  created_at: string
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  if (!isAdminLoggedIn()) throw new Error('Unauthorized')
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    // If the table doesn't exist yet, just return empty array instead of crashing
    if (error.code === '42P01') return []
    throw error
  }
  return data as MediaItem[]
}

export async function addMediaToLibrary(url: string, filename: string, sizeBytes?: number): Promise<MediaItem> {
  if (!isAdminLoggedIn()) throw new Error('Unauthorized')
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('media_library')
    .insert([{ url, filename, size_bytes: sizeBytes }])
    .select()
    .single()

  if (error) {
    if (error.code === '42P01') {
      // Graceful fallback if migration not run yet
      return {
        id: crypto.randomUUID(),
        url,
        filename,
        size_bytes: sizeBytes || null,
        created_at: new Date().toISOString()
      }
    }
    throw error
  }
  return data as MediaItem
}

export async function deleteMediaFromLibrary(id: string): Promise<void> {
  if (!isAdminLoggedIn()) throw new Error('Unauthorized')
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id)

  if (error && error.code !== '42P01') {
    throw error
  }
}
