import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description?: string
  keywords?: string
  type?: string
}

export default function SEO({ 
  title, 
  description = "Boutique Fashion – Discover elegant, premium clothing.", 
  keywords = "boutique, fashion, clothing, dresses",
  type = "website" 
}: SEOProps) {
  const fullTitle = `${title} | Boutique Fashion`
  const canonicalUrl = typeof window !== 'undefined' 
    ? `https://boutique-fashion.vercel.app${window.location.pathname}`
    : 'https://boutique-fashion.vercel.app'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
