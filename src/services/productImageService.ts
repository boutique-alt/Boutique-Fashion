import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from '../config/env'
import { compressImageFile } from '../utils/compressImage'
import { hasSupabaseAdminSession, isAdminLoggedIn } from './adminService'

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
  
  if (!isCloudinaryConfigured() || !isAdminLoggedIn()) {
    return blobToDataUrl(compressed)
  }

  if (!(await hasSupabaseAdminSession())) {
    return blobToDataUrl(compressed)
  }

  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!)
  formData.append('folder', 'boutique/products')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to upload image to Cloudinary')
  }

  const data = await res.json()
  return data.secure_url
}
