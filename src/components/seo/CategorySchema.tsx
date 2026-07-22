import { Helmet } from 'react-helmet-async'
import type { CategoryConfig } from '../../data/categories'
import { brand } from '../../data/navigation'
import { slugFromHref } from '../../utils/productSlug'

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
    ...(category.products && category.products.length > 0 ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: category.products.length,
        itemListElement: category.products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://boutiquefashion.shop/product/${slugFromHref(product.href)}`,
          name: product.name,
          image: product.image.startsWith('http') ? product.image : `https://boutiquefashion.shop${product.image}`,
        })),
      },
    } : {}),
  }

  return (
    <Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Helmet>
  )
}
