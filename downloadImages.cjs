const fs = require('fs');
const path = require('path');

const BF = 'https://boutiquefashion.shop/wp-content/uploads';

const images = [
  { url: `${BF}/2026/02/Boutique-Fashion_-New-Logo_V4.png`, name: 'logo.png' },
  { url: `${BF}/2026/03/home-ban-2.png`, name: 'home-ban-2.png' },
  { url: `${BF}/2026/03/prod-2.png`, name: 'prod-2.png' },
  { url: `${BF}/2026/03/1.png`, name: '1.png' },
  { url: `${BF}/2026/03/4.png`, name: '4.png' },
  { url: `${BF}/2022/01/breadcrumbs-woo.jpg`, name: 'breadcrumbs-woo.jpg' },
];

const destDir = path.join(__dirname, 'public', 'images', 'assets');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function download() {
  for (const img of images) {
    const dest = path.join(destDir, img.name);
    console.log(`Downloading ${img.url}...`);
    try {
      const response = await fetch(img.url);
      if (!response.ok) {
        console.error(`Failed to download ${img.url}: ${response.status} ${response.statusText}`);
        continue;
      }
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      console.log(`Saved ${img.name}`);
    } catch (err) {
      console.error(`Error downloading ${img.url}: ${err.message}`);
    }
  }
}

download();
