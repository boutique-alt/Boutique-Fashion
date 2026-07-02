import { Link } from 'react-router-dom'

interface RegisterConsentCheckboxesProps {
  termsAccepted: boolean
  privacyAccepted: boolean
  onTermsChange: (checked: boolean) => void
  onPrivacyChange: (checked: boolean) => void
}

export default function RegisterConsentCheckboxes({
  termsAccepted,
  privacyAccepted,
  onTermsChange,
  onPrivacyChange,
}: RegisterConsentCheckboxesProps) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal/80">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-maroon"
        />
        <span>
          I agree to the{' '}
          <Link
            to="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-maroon underline underline-offset-2 hover:text-maroon-light"
          >
            Terms &amp; Conditions
          </Link>
        </span>
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal/80">
        <input
          type="checkbox"
          checked={privacyAccepted}
          onChange={(e) => onPrivacyChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-maroon"
        />
        <span>
          I agree to the{' '}
          <Link
            to="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-maroon underline underline-offset-2 hover:text-maroon-light"
          >
            Privacy Policy
          </Link>
        </span>
      </label>
    </div>
  )
}
