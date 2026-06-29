import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath)) {
    console.log(`Exists: ${destPath}`)
    return
  }
  console.log(`Downloading: ${url} -> ${destPath}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  await pipeline(res.body, fs.createWriteStream(destPath))
}

async function run() {
  const products = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    console.log(`Fetching products page ${page}...`)
    const res = await fetch(`https://boutiquefashion.shop/wp-json/wp/v2/product?per_page=100&page=${page}`)
    if (!res.ok) break
    const data = await res.json()
    products.push(...data)
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1')
    page++
  }

  console.log(`Fetched ${products.length} products.`)

  const categories = {
    'blouse': { folder: 'public/images/blouse' },
    'one-piece': { folder: 'public/images/dresses' },
    'two-piece': { folder: 'public/images/kurta-coord' },
    'mens': { folder: 'public/images/mens' },
    'three-piece': { folder: 'public/images/suit-set' },
    'tops-pant-skirt': { folder: 'public/images/tops-pant-skirt' }
  }

  // Fetch media for products
  const mediaMap = {}
  console.log('Fetching media...')
  
  // We can fetch all media and map by parent
  let mpage = 1
  let mtotal = 1
  while (mpage <= mtotal) {
    const res = await fetch(`https://boutiquefashion.shop/wp-json/wp/v2/media?per_page=100&page=${mpage}`)
    if (!res.ok) break
    const mdata = await res.json()
    for (const m of mdata) {
      if (m.post) {
        if (!mediaMap[m.post]) mediaMap[m.post] = []
        mediaMap[m.post].push(m.source_url)
      }
    }
    mtotal = parseInt(res.headers.get('x-wp-totalpages') || '1')
    mpage++
  }

  console.log(`Fetched media, mapped to ${Object.keys(mediaMap).length} posts.`)

  const results = {}

  for (const product of products) {
    const title = product.title.rendered.toLowerCase().replace(/&#[0-9]+;/g, '')
    // get media for this product
    const images = mediaMap[product.id] || []
    
    // figure out which category this might match
    // Or we just save a JSON file and use it to update the code
    results[product.slug] = images
    results[title] = images
  }

  fs.writeFileSync('product_images.json', JSON.stringify(results, null, 2))
  console.log('Saved product_images.json')
}

run().catch(console.error)
