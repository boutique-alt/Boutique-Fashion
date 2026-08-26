import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title: string
  description?: string
  keywords?: string
  type?: string
  image?: string
  schema?: Record<string, any> | Record<string, any>[]
  robots?: string
}

const SITE = 'https://boutiquefashion.shop'

export function pageCanonical(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized ? `${SITE}${normalized}` : `${SITE}/`
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
  const { pathname } = useLocation()
  const canonicalUrl = pageCanonical(pathname)
  const fullTitle = `${title} | Boutique Fashion`

  useEffect(() => {
    const links = Array.from(document.querySelectorAll('link[rel="canonical"]'))
    if (links.length === 0) return
    links[0].setAttribute('href', canonicalUrl)
    links.slice(1).forEach((el) => el.remove())
  }, [canonicalUrl])

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
