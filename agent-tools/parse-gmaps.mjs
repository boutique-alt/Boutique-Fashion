import fs from 'fs'

const html = fs.readFileSync('c:/Users/haslb/OneDrive/Desktop/Bootiq-JS/agent-tools/gmaps.html', 'utf8')
const m = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);window\.APP_FLAGS/)
if (!m) {
  console.log('no state')
  process.exit(1)
}

const state = JSON.parse(m[1])
const str = JSON.stringify(state)

const reviewTexts = [...str.matchAll(/"((?:[^"\\]|\\.){20,500})"/g)]
  .map((x) => x[1].replace(/\\n/g, ' '))
  .filter(
    (t) =>
      /quality|collection|boutique|saree|dress|fabric|stitch|shop|service|recommend|love|amazing|beautiful|perfect|owner|helpful|visit|buy|order|delivery|fit|elegant|comfort|nice|good|best|happy|experience/i.test(
        t,
      ) &&
      !/http|google|maps|function|javascript|svg|png|jpg|width|height|color|style|Boutique Fashion|Garia Station/i.test(
        t,
      ),
  )

console.log('potential reviews:', reviewTexts.length)
reviewTexts.slice(0, 30).forEach((t, i) => console.log(`${i + 1}. ${t}`))

const ratingMatches = [...str.matchAll(/"([0-5]\.[0-9])",(\d+)/g)]
console.log('rating matches:', ratingMatches.slice(0, 5))
