import { scraper } from 'google-maps-review-scraper'
import fs from 'fs'

const url =
  'https://www.google.com/maps/place/Boutique+Fashion/@22.4632844,88.380188,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0271299747d20f:0xb9ba82fc5fd031e7!8m2!3d22.4632795!4d88.3827629!16s%2Fg%2F11ycq50x8x'

const raw = await scraper(url, {
  sort_type: 'newest',
  pages: 'max',
  clean: false,
  experimental: true,
})

function parseRawReview(r) {
  const rating = r[1]
  const date = r[2]?.[0] ?? ''
  const name = r[3]?.[0] ?? 'Google User'
  const textCandidates = r.filter(
    (item, idx) =>
      typeof item === 'string' &&
      item.length > 3 &&
      idx > 10 &&
      !item.startsWith('http') &&
      !item.includes('google.com') &&
      item !== 'en' &&
      item !== date &&
      !item.startsWith('Thank you'),
  )
  const text = textCandidates[0] ?? ''
  return { name, rating, date, text }
}

const parsed = raw.map(parseRawReview).filter((r) => r.text)
console.log(JSON.stringify(parsed, null, 2))
fs.writeFileSync('parsed-reviews.json', JSON.stringify(parsed, null, 2))
