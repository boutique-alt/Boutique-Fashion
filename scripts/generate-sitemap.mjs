import fs from 'fs'
import path from 'path'

const dir = 'src/data'
const files = fs.readdirSync(dir).filter((f) => f.endsWith('Products.ts'))
const slugs = new Set()

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8')
  const re = /\/product\/([a-z0-9-]+)/gi
  let m
  while ((m = re.exec(text))) slugs.add(m[1])
}

const lastmod = '2026-08-26'
const base = 'https://www.boutiquefashion.shop'

function url(loc, changefreq, priority) {
  return `  <url>
    <loc>${base}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const pages = [
  url('/', 'weekly', '1.0'),
  url('/shop/all', 'weekly', '0.9'),
  url('/dress', 'weekly', '0.9'),
  url('/dress/one-piece', 'weekly', '0.8'),
  url('/dress/kurta-set', 'weekly', '0.8'),
  url('/dress/coord-set', 'weekly', '0.8'),
  url('/dress/tops-pant', 'weekly', '0.8'),
  url('/dress/tops-skirt', 'weekly', '0.8'),
  url('/mens', 'weekly', '0.8'),
  url('/blouse', 'weekly', '0.8'),
  url('/three-piece', 'weekly', '0.8'),
  url('/fabric', 'weekly', '0.8'),
  url('/bridal', 'weekly', '0.8'),
  url('/bridal/women', 'weekly', '0.8'),
  url('/bridal/groom', 'weekly', '0.7'),
  url('/about-us', 'monthly', '0.6'),
  url('/contact-us', 'monthly', '0.6'),
  url('/terms-and-conditions', 'yearly', '0.3'),
  url('/privacy-policy', 'yearly', '0.3'),
  url('/sitemap', 'monthly', '0.4'),
]

const products = [...slugs].sort().map((s) => url(`/product/${s}`, 'weekly', '0.7'))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages, ...products].join('\n')}
</urlset>
`

fs.writeFileSync('public/sitemap.xml', xml)
console.log(`pages ${pages.length}`)
console.log(`products ${products.length}`)
console.log(`total ${pages.length + products.length}`)
