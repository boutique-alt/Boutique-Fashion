import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from '../config/env'
import { hasSupabaseAdminSession, isAdminLoggedIn } from './adminService'

const MAX_VIDEO_BYTES = 50 * 1024 * 1024

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read video'))
    reader.readAsDataURL(blob)
  })
}

export async function uploadProductVideo(file: File): Promise<string> {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a video file')
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video must be under 50 MB')
  }

  if (!isCloudinaryConfigured() || !isAdminLoggedIn()) {
    return blobToDataUrl(file)
  }

  if (!(await hasSupabaseAdminSession())) {
    return blobToDataUrl(file)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!)
  formData.append('folder', 'boutique/videos')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to upload video to Cloudinary')
  }

  const data = await res.json()
  return data.secure_url
}
