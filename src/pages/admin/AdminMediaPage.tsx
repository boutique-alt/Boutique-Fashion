import { useState, useEffect, useRef } from 'react'
import { ImagePlus, Copy, Check, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { getMediaLibrary, addMediaToLibrary, deleteMediaFromLibrary, type MediaItem } from '../../services/mediaService'
import { uploadProductImage } from '../../services/productImageService'

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const data = await getMediaLibrary()
      setMedia(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    
    let successCount = 0
    let failedCount = 0

    const newMedia: MediaItem[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        failedCount++
        continue
      }
      try {
        const url = await uploadProductImage(file)
        const mediaItem = await addMediaToLibrary(url, file.name, file.size)
        newMedia.push(mediaItem)
        successCount++
      } catch (err) {
        console.error('Failed to upload', file.name, err)
        failedCount++
      }
    }

    if (newMedia.length > 0) {
      setMedia(prev => [...newMedia, ...prev])
    }

    if (failedCount > 0) {
      setError(`Successfully uploaded ${successCount} images. Failed to upload ${failedCount} images.`)
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image record?')) return
    try {
      await deleteMediaFromLibrary(id)
      setMedia(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      alert('Failed to delete media')
    }
  }

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Media Gallery</h1>
          <p className="mt-2 text-sm text-charcoal/70">
            Upload images here to get their URLs for the Bulk Upload Excel sheet. All images are automatically compressed.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-maroon px-5 py-2.5 text-sm font-medium tracking-[0.15em] text-cream uppercase transition-colors hover:bg-maroon-light disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded border border-red-200 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent"></div>
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/50 p-12 text-center">
          <ImagePlus size={48} className="mb-4 text-charcoal/20" />
          <h3 className="mb-2 font-serif text-xl text-charcoal">No Images Yet</h3>
          <p className="mb-6 text-sm text-charcoal/60 max-w-md">
            Click "Upload Images" to select files from your computer. Their URLs will appear here instantly.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-maroon px-6 py-2 text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:bg-maroon hover:text-cream transition-colors"
          >
            Select Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded border border-accent bg-accent shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-cream-dark relative">
                <img 
                  src={item.url} 
                  alt={item.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-accent/90 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-charcoal truncate mb-2" title={item.filename}>
                  {item.filename}
                </p>
                <button
                  onClick={() => handleCopyLink(item.url, item.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase border border-accent text-charcoal hover:bg-accent/10 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={12} className="text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
