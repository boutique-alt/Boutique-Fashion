import { isSupabaseConfigured } from '../config/env'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { compressImageFile } from '../utils/compressImage'
import { hasSupabaseAdminSession, isAdminLoggedIn } from './adminService'

const BUCKET = 'product-images'

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(blob)
  })
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file')
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image must be under 8 MB')
  }

  const compressed = await compressImageFile(file)
  const dataUrl = await blobToDataUrl(compressed)

  if (!isSupabaseConfigured() || !isAdminLoggedIn()) {
    return dataUrl
  }

  if (!(await hasSupabaseAdminSession())) {
    return dataUrl
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const client = getSupabaseAdmin()
  const { error } = await client.storage.from(BUCKET).upload(path, compressed, {
    contentType: 'image/jpeg',
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return dataUrl

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
