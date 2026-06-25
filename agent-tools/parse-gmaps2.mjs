import fs from 'fs'

function walk(node, out = []) {
  if (typeof node === 'string') {
    if (node.length >= 15 && node.length <= 600) out.push(node)
    return out
  }
  if (Array.isArray(node)) {
    for (const item of node) walk(item, out)
    return out
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) walk(value, out)
  }
  return out
}

const html = fs.readFileSync('c:/Users/haslb/OneDrive/Desktop/Bootiq-JS/agent-tools/gmaps.html', 'utf8')
const m = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);window\.APP_FLAGS/)
if (!m) {
  console.log('no state')
  process.exit(1)
}

const state = JSON.parse(m[1])
const strings = walk(state)

const likelyReviews = strings.filter(
  (t) =>
    t.split(' ').length >= 4 &&
    /[a-z]/i.test(t) &&
    !/^[0-9.]+$/.test(t) &&
    !/http|@|\.com|google|maps|Boutique Fashion|Garia Station|Juthika|Kolkata|West Bengal|0x|\/g\//i.test(t) &&
    /quality|collection|saree|dress|fabric|stitch|shop|service|recommend|love|amazing|beautiful|perfect|owner|helpful|visit|buy|order|delivery|fit|elegant|comfort|nice|good|best|happy|experience|compliment|design|staff|friendly|reasonable|premium|custom|kurta|blouse|outfit|wear|clothes|fashion|boutique|tailor|stitching/i.test(
      t,
    ),
)

console.log('likely reviews:', likelyReviews.length)
likelyReviews.slice(0, 40).forEach((t, i) => console.log(`${i + 1}. ${t}`))

const names = strings.filter(
  (t) =>
    /^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}$/.test(t) &&
    !['Boutique Fashion', 'Garia Station', 'West Bengal', 'New Review'].includes(t),
)
console.log('\nlikely names:', [...new Set(names)].slice(0, 30).join(', '))

const ratings = strings.filter((t) => /^[1-5]$/.test(t))
console.log('rating digits sample:', ratings.slice(0, 20))

// look for review count / average
const all = JSON.stringify(state)
const countMatch = all.match(/"([45]\.[0-9])",(\d{1,4})/)
console.log('count match:', countMatch)
