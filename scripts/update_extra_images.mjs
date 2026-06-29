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

const dataFiles = [
  'blouseProducts.ts',
  'dressProducts.ts',
  'kurtaCoordProducts.ts',
  'mensProducts.ts',
  'suitSetProducts.ts',
  'topsPantSkirtProducts.ts'
]

const productImages = JSON.parse(fs.readFileSync('product_images.json', 'utf-8'))

async function processFiles() {
  for (const file of dataFiles) {
    const filePath = path.join('src', 'data', file)
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Find all objects with href
    const regex = /href:\s*'https:\/\/boutiquefashion\.shop\/product\/([^/]+)\/'/g
    let match
    let modified = false
    let newContent = content

    while ((match = regex.exec(content)) !== null) {
      const slug = match[1]
      const images = productImages[slug] || []
      if (images.length > 0) {
        // Prepare local paths
        const folderName = file.replace('Products.ts', '') // simple mapping
        const dir = path.join('public', 'images', folderName)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

        const localPaths = []
        for (let i = 0; i < images.length; i++) {
          const url = images[i]
          const ext = path.extname(new URL(url).pathname) || '.png'
          const localName = `${slug}-${i + 1}${ext}`
          const localPath = path.join(dir, localName)
          await downloadImage(url, localPath)
          localPaths.push(`/images/${folderName}/${localName}`)
        }

        // Insert `images: [...]` into the object right before the href
        const insertStr = `images: ${JSON.stringify(localPaths)},\n    `
        newContent = newContent.replace(match[0], insertStr + match[0])
        modified = true
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent)
      console.log(`Updated ${file}`)
    }
  }
}

processFiles().catch(console.error)
