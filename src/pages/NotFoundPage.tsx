import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20 pt-[var(--site-header-height)]">
      <Helmet>
        <title>Page Not Found | Boutique Fashion</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="px-4 text-center">
        <h1 className="font-serif text-6xl text-maroon">404</h1>
        <p className="mt-4 text-sm text-charcoal/60">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block text-xs font-medium tracking-[0.15em] text-maroon uppercase hover:text-maroon-light"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
