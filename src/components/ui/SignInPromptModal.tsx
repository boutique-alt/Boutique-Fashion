import { useEffect } from 'react'
import { X, MessageCircle } from 'lucide-react'

interface SignInPromptModalProps {
  onClose: () => void
  onSignIn: () => void
  onRegister: () => void
}

export default function SignInPromptModal({ onClose, onSignIn, onRegister }: SignInPromptModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-prompt-title"
        className="relative w-full max-w-md rounded-md border border-accent bg-cream p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal/60 transition-colors hover:bg-black/5 hover:text-charcoal"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon">
          <MessageCircle size={22} />
        </div>

        <h2 id="signin-prompt-title" className="font-serif text-xl text-charcoal">
          Please sign in to message
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          Sign in or create an account to chat with us on WhatsApp. We’ll open your message as soon as you’re in.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onRegister}
            className="w-full bg-maroon py-3 text-[13px] font-medium tracking-wide text-white uppercase transition-colors hover:bg-maroon-light"
          >
            Create Account
          </button>
          <button
            onClick={onSignIn}
            className="w-full border border-maroon/30 bg-transparent py-3 text-[13px] font-medium tracking-wide text-maroon uppercase transition-colors hover:bg-maroon/5"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
