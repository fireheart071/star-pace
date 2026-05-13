const https = require('https')
const fs = require('fs')
const path = require('path')

const assets = path.resolve(__dirname, '..', 'public', 'assets')
if (!fs.existsSync(assets)) fs.mkdirSync(assets, { recursive: true })

const images = [
  { name: 'lux.jpg', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80' },
  { name: 'sport.jpg', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80' },
  { name: 'tour.jpg', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80' },
  { name: 'hero.jpg', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80' }
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Failed to download ' + url))
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

;(async () => {
  for (const img of images) {
    const dest = path.join(assets, img.name)
    try {
      console.log('Downloading', img.url)
      await download(img.url, dest)
      console.log('Saved', dest)
    } catch (e) {
      console.error('Error downloading', img.url, e.message)
    }
  }
  console.log('Done')
})()
