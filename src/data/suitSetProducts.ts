import type { Product } from './products'

const IMG = (n: number) => `/images/suit-set/${String(n).padStart(2, '0')}.png`

export const suitSetCategoryImage = IMG(11)

export const suitSetProducts: Product[] = [
  {
    id: 'th1',
    name: 'Maroon Beige Block Print Suit Set',
    price: 2600,
    image: IMG(1),
    href: 'https://boutiquefashion.shop/product/maroon-beige-block-print-suit-set/',
  },
  {
    id: 'th2',
    name: 'Bright Pink Embroidered Suit Set',
    price: 3200,
    image: IMG(2),
    href: 'https://boutiquefashion.shop/product/bright-pink-embroidered-suit-set/',
  },
  {
    id: 'th3',
    name: 'Lime Green Block Print Suit Set',
    price: 2400,
    image: IMG(3),
    href: 'https://boutiquefashion.shop/product/lime-green-block-print-suit-set/',
  },
  {
    id: 'th4',
    name: 'White Blue Block Print Suit Set',
    price: 2500,
    image: IMG(4),
    href: 'https://boutiquefashion.shop/product/white-blue-block-print-suit-set/',
  },
  {
    id: 'th5',
    name: 'Rust Orange Embroidered Suit Set',
    price: 2450,
    image: IMG(5),
    href: 'https://boutiquefashion.shop/product/rust-orange-embroidered-suit-set/',
  },
  {
    id: 'th6',
    name: 'Red Floral Embroidered Suit Set',
    price: 2900,
    image: IMG(6),
    href: 'https://boutiquefashion.shop/product/red-floral-embroidered-suit-set/',
  },
  {
    id: 'th7',
    name: 'Black Floral Embroidered Suit Set',
    price: 3100,
    image: IMG(7),
    href: 'https://boutiquefashion.shop/product/black-floral-embroidered-suit-set/',
  },
  {
    id: 'th8',
    name: 'Olive Green Embroidered Suit Set',
    price: 2700,
    originalPrice: 3200,
    onSale: true,
    image: IMG(8),
    href: 'https://boutiquefashion.shop/product/olive-green-mul-chanderi-boolean-work-three-piece-set/',
  },
  {
    id: 'th9',
    name: 'Cream Floral Embroidered Suit Set',
    price: 2550,
    image: IMG(9),
    href: 'https://boutiquefashion.shop/product/cream-floral-embroidered-suit-set/',
  },
  {
    id: 'th10',
    name: 'Lavender Embroidered Suit Set',
    price: 2650,
    image: IMG(10),
    href: 'https://boutiquefashion.shop/product/lavender-embroidered-suit-set/',
  },
  {
    id: 'th11',
    name: 'Mustard Yellow Floral Suit Set',
    price: 2750,
    image: IMG(11),
    href: 'https://boutiquefashion.shop/product/mustard-yellow-floral-suit-set/',
  },
  {
    id: 'th12',
    name: 'Blue Grey Block Print Suit Set',
    price: 2350,
    originalPrice: 2699,
    onSale: true,
    image: IMG(12),
    href: 'https://boutiquefashion.shop/product/blue-grey-block-print-suit-set/',
  },
]
