import { Helmet } from 'react-helmet-async'
import type { CategoryConfig } from '../../data/categories'
import { brand } from '../../data/navigation'

interface CategorySchemaProps {
  category: CategoryConfig
}

export function CategorySchema({ category }: CategorySchemaProps) {
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : `${category.parent.href}/${category.slug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.title,
    description: category.description,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: brand.name,
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
