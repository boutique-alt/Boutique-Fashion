import { useEffect, useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { env } from '../../config/env'
import { upiPaymentDetails } from '../../data/payment'
import { buildUpiPaymentLink, buildUpiQrUrl } from '../../utils/upi'
import UpiScreenshotUpload from './UpiScreenshotUpload'

const QR_SIZE = 300

interface UpiPaymentPanelProps {
  amount: number
  screenshotUrl: string | null
  onScreenshotChange: (url: string | null) => void
}

export default function UpiPaymentPanel({ amount, screenshotUrl, onScreenshotChange }: UpiPaymentPanelProps) {
  const [copied, setCopied] = useState(false)

  const [qrUrl, setQrUrl] = useState('')

  const upiLink = useMemo(
    () => buildUpiPaymentLink(env.upiId, env.upiPayeeName, amount),
    [amount],
  )

  useEffect(() => {
    let mounted = true
    buildUpiQrUrl(upiLink, QR_SIZE).then((url) => {
      if (mounted) setQrUrl(url)
    })
    return () => {
      mounted = false
    }
  }, [upiLink])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(env.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4 border border-accent bg-cream-dark/30 p-5">
      <div>
        <h3 className="font-serif text-lg text-charcoal">Pay via UPI</h3>
        <p className="mt-1 text-xs text-charcoal/60">
          Scan the QR code — the order amount will be filled automatically. After paying, upload your payment screenshot and place the order.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="shrink-0 rounded border border-accent bg-accent p-3">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="UPI payment QR code"
              width={QR_SIZE}
              height={QR_SIZE}
              className="h-[300px] w-[300px] object-contain"
            />
          ) : (
            <div className="flex h-[300px] w-[300px] items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-400">Generating QR...</span>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 text-sm">
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase">Amount</p>
            <p className="mt-1 font-serif text-2xl text-maroon">
              ₹{amount.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase">UPI ID</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-medium text-charcoal">{env.upiId}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-medium tracking-wide text-maroon uppercase hover:text-maroon-light"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase">Mobile</p>
            <p className="mt-1 text-charcoal/80">{upiPaymentDetails.mobile}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] text-charcoal/50 uppercase">Payee</p>
            <p className="mt-1 text-charcoal/80">{env.upiPayeeName}</p>
          </div>
          <a
            href={upiLink}
            className="inline-block text-xs font-medium text-maroon hover:text-maroon-light"
          >
            Open in UPI app (mobile)
          </a>
        </div>
      </div>

      <UpiScreenshotUpload value={screenshotUrl} onChange={onScreenshotChange} />

      <p className="text-[10px] text-charcoal/40">
        Payment verification is manual. Your order will be confirmed after we verify the UPI payment.
      </p>
    </div>
  )
}
