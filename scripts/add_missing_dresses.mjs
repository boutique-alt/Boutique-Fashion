import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath)) return
  console.log(`Downloading: ${url} -> ${destPath}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  await pipeline(res.body, fs.createWriteStream(destPath))
}

function cleanTitle(title) {
  return title.replace(/&#[0-9]+;/g, '').trim()
}

async function run() {
  const categoryId = 95
  
  // Fetch products
  const products = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const res = await fetch(`https://boutiquefashion.shop/wp-json/wp/v2/product?categories=${categoryId}&per_page=100&page=${page}`)
    if (!res.ok) break
    const data = await res.json()
    products.push(...data)
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1')
    page++
  }

  // Fetch media map
  const mediaMap = {}
  const productImages = JSON.parse(fs.readFileSync('product_images.json', 'utf-8') || '{}')
  
  const existingFilePath = path.join('src', 'data', 'dressProducts.ts')
  let tsContent = fs.readFileSync(existingFilePath, 'utf-8')

  // Identify existing products by slug
  const existingSlugs = []
  const slugRegex = /href:\s*'https:\/\/boutiquefashion\.shop\/product\/([^/]+)\/'/g
  let match
  while ((match = slugRegex.exec(tsContent)) !== null) {
    existingSlugs.push(match[1])
  }

  console.log(`Found ${existingSlugs.length} existing dresses.`)
  
  let newDressesCount = 0
  let nextIdNum = existingSlugs.length + 1

  let newEntries = []

  for (const product of products) {
    if (existingSlugs.includes(product.slug)) continue // Skip existing

    console.log(`New dress found: ${product.slug}`)
    newDressesCount++
    
    const title = cleanTitle(product.title.rendered)
    // Extract price from rendered content or assume standard structure. WP REST API doesn't expose Woo price directly without Woo API, but it might be in content or we can use a dummy for now.
    // Wait, let's see if we can parse the price from the HTML content if possible.
    // Or we will just set a default price and let the user update.
    let price = 1500
    
    // Download main image (featured_media)
    let mainImageUrl = ''
    if (product.featured_media) {
      const mediaRes = await fetch(`https://boutiquefashion.shop/wp-json/wp/v2/media/${product.featured_media}`)
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        mainImageUrl = mediaData.source_url
      }
    }

    // Download images
    const localDir = path.join('public', 'images', 'dresses')
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true })

    let mainLocalPath = ''
    if (mainImageUrl) {
      const ext = path.extname(new URL(mainImageUrl).pathname) || '.png'
      const mainName = `${product.slug}-main${ext}`
      const dest = path.join(localDir, mainName)
      await downloadImage(mainImageUrl, dest)
      mainLocalPath = `/images/dresses/${mainName}`
    }

    // Extra images
    const extraUrls = productImages[product.slug] || []
    const extraLocalPaths = []
    for (let i = 0; i < extraUrls.length; i++) {
      const url = extraUrls[i]
      const ext = path.extname(new URL(url).pathname) || '.png'
      const eName = `${product.slug}-${i+1}${ext}`
      const dest = path.join(localDir, eName)
      await downloadImage(url, dest)
      extraLocalPaths.push(`/images/dresses/${eName}`)
    }

    const imagesStr = extraLocalPaths.length > 0 ? `\n    images: ${JSON.stringify(extraLocalPaths)},` : ''

    const entry = `  {
    id: 'op${nextIdNum}',
    name: '${title}',
    price: ${price},
    image: '${mainLocalPath}',${imagesStr}
    href: 'https://boutiquefashion.shop/product/${product.slug}/',
  },`
    newEntries.push(entry)
    nextIdNum++
  }

  if (newEntries.length > 0) {
    // Insert before the last `]`
    const insertPosition = tsContent.lastIndexOf(']')
    const updatedContent = tsContent.substring(0, insertPosition) + newEntries.join('\n') + '\n' + tsContent.substring(insertPosition)
    fs.writeFileSync(existingFilePath, updatedContent)
    console.log(`Added ${newEntries.length} new dresses to dressProducts.ts`)
  } else {
    console.log('No new dresses found.')
  }
}

run().catch(console.error)
