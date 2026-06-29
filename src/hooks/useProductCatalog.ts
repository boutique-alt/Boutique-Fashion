import { useEffect, useState } from 'react'
import { getAllProductDetails } from '../data/productCatalog'
import { getCatalogVersion, subscribeProductCatalog } from '../services/productService'

export function useProductCatalog() {
  const [version, setVersion] = useState(getCatalogVersion)

  useEffect(() => subscribeProductCatalog(() => setVersion(getCatalogVersion())), [])

  return { products: getAllProductDetails(), version }
}
