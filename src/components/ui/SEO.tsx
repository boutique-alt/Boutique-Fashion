import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description?: string
  keywords?: string
  type?: string
  image?: string
  schema?: Record<string, any> | Record<string, any>[]
  robots?: string
}

export default function SEO({ 
  title, 
  description = "Boutique Fashion – Discover elegant, premium clothing.", 
  keywords = "boutique, fashion, clothing, dresses",
  type = "website",
  image = "/images/about/team-hero.webp",
  schema,
  robots = "index, follow"
}: SEOProps) {
  const fullTitle = `${title} | Boutique Fashion`
  const canonicalUrl = typeof window !== 'undefined' 
    ? `https://boutiquefashion.shop${window.location.pathname}`
    : 'https://boutiquefashion.shop'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image.startsWith('http') ? image : `https://boutiquefashion.shop${image.startsWith('/') ? image : `/${image}`}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </Helmet>
  )
}
