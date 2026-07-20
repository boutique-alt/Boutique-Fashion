import type { Product } from './products'

const IMG = (n: number) => `/images/blouse/${String(n).padStart(2, '0')}.webp`

export const blouseCategoryImage = IMG(11)

export const blouseProducts: Product[] = [
  {
    id: 'bl1',
    name: 'Ajrakh Sleeveless V-Neck Cropped Blouse',
    price: 2300,
    image: IMG(1),
    isNew: true,
    isBestSeller: true,
    href: 'https://boutiquefashion.shop/product/blue-designer-silk-blouse-with-back-design/',
  },
  {
    id: 'bl2',
    name: 'Terracotta Checkered Sleeveless Blouse',
    price: 2100,
    image: IMG(2),
    href: 'https://boutiquefashion.shop/product/brocade-designer-sweetheart-neck-blouse/',
  },
  {
    id: 'bl3',
    name: 'Yellow Orange Tie-Dye Floral Blouse',
    price: 1800,
    originalPrice: 2100,
    onSale: true,
    image: IMG(3),
    href: 'https://boutiquefashion.shop/product/maroon-luxury-wedding-designer-blouse/',
  },
  {
    id: 'bl4',
    name: 'Green Kalamkari Square Neck Blouse',
    price: 2400,
    image: IMG(4),
    images: ["/images/blouse/peach-sea-waves-designer-blouse-1.webp","/images/blouse/peach-sea-waves-designer-blouse-2.webp","/images/blouse/peach-sea-waves-designer-blouse-3.webp","/images/blouse/peach-sea-waves-designer-blouse-4.webp","/images/blouse/peach-sea-waves-designer-blouse-5.webp","/images/blouse/peach-sea-waves-designer-blouse-6.webp","/images/blouse/peach-sea-waves-designer-blouse-7.webp","/images/blouse/peach-sea-waves-designer-blouse-8.webp","/images/blouse/peach-sea-waves-designer-blouse-9.webp","/images/blouse/peach-sea-waves-designer-blouse-10.webp"],
    href: 'https://boutiquefashion.shop/product/peach-sea-waves-designer-blouse/',
  },
  {
    id: 'bl5',
    name: 'Black Kalamkari Square Neck Blouse',
    price: 2200,
    image: IMG(5),
    isNew: true,
    href: 'https://boutiquefashion.shop/product/black-kalamkari-square-neck-blouse/',
  },
  {
    id: 'bl6',
    name: 'Forest Green Ikat Sleeveless Blouse',
    price: 2000,
    image: IMG(6),
    href: 'https://boutiquefashion.shop/product/forest-green-ikat-sleeveless-blouse/',
  },
  {
    id: 'bl7',
    name: 'Green Ikat Band Waist Blouse',
    price: 1950,
    image: IMG(7),
    href: 'https://boutiquefashion.shop/product/green-ikat-band-waist-blouse/',
  },
  {
    id: 'bl8',
    name: 'Ajrakh Indigo Short Sleeve Blouse',
    price: 2150,
    image: IMG(8),
    isBestSeller: true,
    href: 'https://boutiquefashion.shop/product/ajrakh-indigo-short-sleeve-blouse/',
  },
  {
    id: 'bl9',
    name: 'Olive Ikat Wave Print Blouse',
    price: 2050,
    image: IMG(9),
    href: 'https://boutiquefashion.shop/product/olive-ikat-wave-print-blouse/',
  },
  {
    id: 'bl10',
    name: 'Ajrakh Red Black Sleeveless Blouse',
    price: 1900,
    image: IMG(10),
    href: 'https://boutiquefashion.shop/product/ajrakh-red-black-sleeveless-blouse/',
  },
  {
    id: 'bl11',
    name: 'Gold Sequin Sweetheart Neck Blouse',
    price: 2800,
    originalPrice: 3500,
    onSale: true,
    image: IMG(11),
    href: 'https://boutiquefashion.shop/product/gold-sequin-sweetheart-neck-blouse/',
  },
  {
    id: 'bl12',
    name: 'Coral Eyelet Lace V-Neck Blouse',
    price: 2250,
    image: IMG(12),
    href: 'https://boutiquefashion.shop/product/coral-eyelet-lace-v-neck-blouse/',
  },
]
