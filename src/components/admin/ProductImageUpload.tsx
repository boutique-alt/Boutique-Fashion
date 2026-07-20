import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { uploadProductImage } from '../../services/productImageService'

interface ProductImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const url = await uploadProductImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs tracking-wide text-charcoal/70 uppercase">
        Product Image *
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-16 shrink-0 border border-accent object-cover"
           loading="lazy" />
        ) : (
          <div className="flex h-20 w-16 shrink-0 items-center justify-center border border-dashed border-accent bg-cream-dark text-[10px] text-charcoal/40">
            No image
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-accent bg-cream px-3 py-2 text-xs font-medium tracking-wide text-charcoal uppercase transition-colors hover:border-maroon hover:text-maroon disabled:opacity-60"
          >
            <ImagePlus size={14} />
            {uploading ? 'Uploading...' : value ? 'Change' : 'Upload'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-left text-[11px] text-gold hover:underline"
            >
              Remove
            </button>
          )}
          <p className="text-[10px] text-charcoal/40">JPG/PNG, auto-compressed</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-gold">{error}</p>}
    </div>
  )
}
