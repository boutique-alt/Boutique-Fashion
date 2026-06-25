import { scraper } from 'google-maps-review-scraper'

const url =
  'https://www.google.com/maps/place/Boutique+Fashion/@22.4632844,88.380188,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0271299747d20f:0xb9ba82fc5fd031e7!8m2!3d22.4632795!4d88.3827629!16s%2Fg%2F11ycq50x8x'

const reviews = await scraper(url, {
  sort_type: 'newest',
  pages: 'max',
  clean: false,
  experimental: true,
})

console.log('total', reviews.length)
console.log(JSON.stringify(reviews.slice(0, 3), null, 2))
