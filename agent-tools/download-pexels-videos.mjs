import https from 'https'
import fs from 'fs'
import path from 'path'

const ids = [
  4057255, 7681039, 3163534, 6770483, 4823191, 5699810, 7581449, 7978561,
  6612906, 4845951, 5207558, 6312523, 4057255,
]
const outDir = path.join('public', 'videos', 'watch-and-buy')
fs.mkdirSync(outDir, { recursive: true })

function request(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Referer: 'https://www.pexels.com/',
          Accept: '*/*',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : `https://www.pexels.com${res.headers.location}`
          request(next, maxRedirects - 1).then(resolve).catch(reject)
          return
        }
        resolve(res)
      },
    ).on('error', reject)
  })
}

function download(url, file) {
  return new Promise((resolve, reject) => {
    request(url).then((res) => {
      if (res.statusCode !== 200) {
        res.resume()
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      const ws = fs.createWriteStream(file)
      res.pipe(ws)
      ws.on('finish', () => {
        ws.close()
        resolve(fs.statSync(file).size)
      })
      ws.on('error', reject)
    }).catch(reject)
  })
}

for (let i = 0; i < ids.length; i++) {
  const id = ids[i]
  const n = String(i + 1).padStart(2, '0')
  const out = path.join(outDir, `${n}.mp4`)
  const url = `https://www.pexels.com/download/video/${id}/`
  try {
    const size = await download(url, out)
    console.log(`${n} ${id} OK ${size}`)
  } catch (e) {
    console.log(`${n} ${id} FAIL ${e.message}`)
  }
}
