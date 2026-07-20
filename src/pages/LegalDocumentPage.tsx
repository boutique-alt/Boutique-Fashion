import { Navigate } from 'react-router-dom'
import SEO from '../components/ui/SEO'

const documents = {
  terms: {
    path: 'terms-and-conditions',
    title: 'Terms & Conditions',
    sections: [
      {
        heading: 'Use of our website',
        body: 'By creating an account and placing orders on Boutique Fashion, you agree to use our services lawfully and provide accurate account information.',
      },
      {
        heading: 'Orders & payments',
        body: 'All orders are subject to availability. Prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to cancel orders in case of pricing or stock errors.',
      },
      {
        heading: 'Returns & exchanges',
        body: 'Please refer to our return policy on the Returns Centre page for eligibility, timelines, and exchange conditions.',
      },
    ],
  },
  privacy: {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information we collect',
        body: 'We collect information you provide when registering, placing orders, or contacting us, including your name, email, phone number, and delivery address.',
      },
      {
        heading: 'How we use your information',
        body: 'Your information is used to process orders, provide customer support, improve our services, and send important updates related to your account or purchases.',
      },
      {
        heading: 'Data security',
        body: 'We take reasonable measures to protect your personal information. Payment details are processed securely through our payment partners.',
      },
    ],
  },
} as const

type LegalVariant = keyof typeof documents

interface LegalDocumentPageProps {
  variant: LegalVariant
}

export default function LegalDocumentPage({ variant }: LegalDocumentPageProps) {
  const doc = documents[variant]
  if (!doc) return <Navigate to="/" replace />

  return (
    <main>
      <SEO title={doc.title} description={`${doc.title} for Boutique Fashion.`} />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 md:px-6">
          {doc.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-serif text-xl text-charcoal">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
