import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { uploadPaymentScreenshot } from '../../services/paymentScreenshotService'

interface UpiScreenshotUploadProps {
  value: string | null
  onChange: (url: string | null) => void
}

export default function UpiScreenshotUpload({ value, onChange }: UpiScreenshotUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const url = await uploadPaymentScreenshot(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-t border-accent pt-4">
      <label className="mb-1.5 block text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase">
        Payment Screenshot *
      </label>
      <p className="mb-3 text-xs text-charcoal/60">
        Upload a screenshot of your UPI payment confirmation before placing the order.
      </p>
      <div className="flex items-start gap-3">
        {value ? (
          <img
            src={value}
            alt="Payment screenshot preview"
            className="h-28 w-24 shrink-0 border border-accent object-cover"
          />
        ) : (
          <div className="flex h-28 w-24 shrink-0 items-center justify-center border border-dashed border-accent bg-accent text-[10px] text-charcoal/40">
            No image
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-accent bg-accent px-3 py-2 text-xs font-medium tracking-wide text-charcoal uppercase transition-colors hover:border-maroon hover:text-maroon disabled:opacity-60"
          >
            <ImagePlus size={14} />
            {uploading ? 'Uploading...' : value ? 'Change Screenshot' : 'Upload Screenshot'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-left text-[11px] text-gold hover:underline"
            >
              Remove
            </button>
          )}
          <p className="text-[10px] text-charcoal/40">JPG/PNG, max 8 MB</p>
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
