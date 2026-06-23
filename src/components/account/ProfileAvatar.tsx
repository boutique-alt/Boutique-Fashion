import { useRef } from 'react'
import { Camera, User } from 'lucide-react'

interface ProfileAvatarProps {
  name: string
  avatarUrl?: string
  onChange: (dataUrl: string) => void
}

export default function ProfileAvatar({ name, avatarUrl, onChange }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-cream-dark">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <User size={36} className="text-maroon/60" />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-cream transition-colors hover:bg-maroon-light"
          aria-label="Upload profile photo"
        >
          <Camera size={14} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      <p className="mt-3 text-xs text-charcoal/50">Click camera to upload photo</p>
    </div>
  )
}
