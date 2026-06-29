import type { Product } from './products'

const IMG = (n: number) => `/images/kurta-coord/${String(n).padStart(2, '0')}.png`

export const kurtaCoordCategoryImage = IMG(11)

export const kurtaCoordProducts: Product[] = [
  {
    id: 'tp1',
    name: 'White Crop Top & Blue Handblock Skirt Coord Set',
    price: 2200,
    image: IMG(1),
    href: 'https://boutiquefashion.shop/product/white-crop-top-blue-handblock-skirt-coord-set/',
  },
  {
    id: 'tp2',
    name: 'Mustard Crop Top & Teal Ethnic Skirt Coord Set',
    price: 2100,
    image: IMG(2),
    href: 'https://boutiquefashion.shop/product/mustard-crop-top-teal-ethnic-skirt-coord-set/',
  },
  {
    id: 'tp3',
    name: 'Charcoal Top & Folk Art Print Skirt Coord Set',
    price: 2300,
    image: IMG(3),
    href: 'https://boutiquefashion.shop/product/charcoal-top-folk-art-print-skirt-coord-set/',
  },
  {
    id: 'tp4',
    name: 'Green Yellow Tie-Dye Skirt Coord Set',
    price: 2400,
    originalPrice: 2699,
    onSale: true,
    image: IMG(4),
    href: 'https://boutiquefashion.shop/product/green-yellow-tie-dye-skirt-coord-set/',
  },
  {
    id: 'tp5',
    name: 'White Green Tie-Dye Pant Coord Set',
    price: 2400,
    originalPrice: 2699,
    onSale: true,
    image: IMG(5),
    href: 'https://boutiquefashion.shop/product/white-green-tie-dye-pant-coord-set/',
  },
  {
    id: 'tp6',
    name: 'Lime Green Embroidered Kurta with Mustard Trousers',
    price: 1800,
    image: IMG(6),
    href: 'https://boutiquefashion.shop/product/lime-green-embroidered-kurta-mustard-trousers/',
  },
  {
    id: 'tp7',
    name: 'Red Embroidered Kurta with White Trousers',
    price: 1750,
    image: IMG(7),
    href: 'https://boutiquefashion.shop/product/red-embroidered-kurta-white-trousers/',
  },
  {
    id: 'tp8',
    name: 'Black Floral Embroidered Kurta with Silver Trousers',
    price: 1900,
    image: IMG(8),
    href: 'https://boutiquefashion.shop/product/black-floral-embroidered-kurta-silver-trousers/',
  },
  {
    id: 'tp9',
    name: 'Chocolate Brown Embroidered Kurta Set',
    price: 1850,
    image: IMG(9),
    href: 'https://boutiquefashion.shop/product/chocolate-brown-embroidered-kurta-set/',
  },
  {
    id: 'tp10',
    name: 'Teal Floral Embroidered Kurta Set',
    price: 1800,
    originalPrice: 2100,
    onSale: true,
    image: IMG(10),
    images: ["/images/kurtaCoord/teal-green-handpainted-inner-shrug-chanderi-silk-1.png","/images/kurtaCoord/teal-green-handpainted-inner-shrug-chanderi-silk-2.png"],
    href: 'https://boutiquefashion.shop/product/teal-green-handpainted-inner-shrug-chanderi-silk/',
  },
  {
    id: 'tp11',
    name: 'Pink Floral Embroidered Kurta with Teal Trousers',
    price: 1200,
    image: IMG(11),
    images: ["/images/kurtaCoord/cotton-handblock-braided-sleeve-kurti-set-1.png","/images/kurtaCoord/cotton-handblock-braided-sleeve-kurti-set-2.png"],
    href: 'https://boutiquefashion.shop/product/cotton-handblock-braided-sleeve-kurti-set/',
  },
  {
    id: 'tp12',
    name: 'Lime Yellow Angrakha Kurti with Light Blue Trousers',
    price: 1650,
    image: IMG(12),
    href: 'https://boutiquefashion.shop/product/lime-yellow-angrakha-kurti-light-blue-trousers/',
  },
  {
    id: 'tp13',
    name: 'Rust Heritage Kurta with Cream Trousers',
    price: 1700,
    image: IMG(13),
    href: 'https://boutiquefashion.shop/product/rust-heritage-kurta-cream-trousers/',
  },
  {
    id: 'tp14',
    name: 'Lime Green Embroidered Kurta with Brown Trousers',
    price: 1600,
    image: IMG(14),
    href: 'https://boutiquefashion.shop/product/lime-green-embroidered-kurta-brown-trousers/',
  },
]
