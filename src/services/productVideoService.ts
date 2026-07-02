import { isSupabaseConfigured } from '../config/env'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'
import { hasSupabaseAdminSession, isAdminLoggedIn } from './adminService'

const BUCKET = 'product-images'
const MAX_VIDEO_BYTES = 50 * 1024 * 1024

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read video'))
    reader.readAsDataURL(blob)
  })
}

function videoExtension(file: File): string {
  if (file.type === 'video/quicktime') return 'mov'
  if (file.type === 'video/webm') return 'webm'
  return 'mp4'
}

export async function uploadProductVideo(file: File): Promise<string> {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a video file')
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video must be under 50 MB')
  }

  if (!isSupabaseConfigured() || !isAdminLoggedIn()) {
    return blobToDataUrl(file)
  }

  if (!(await hasSupabaseAdminSession())) {
    return blobToDataUrl(file)
  }

  const ext = videoExtension(file)
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const client = getSupabaseAdmin()
  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'video/mp4',
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return blobToDataUrl(file)

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
