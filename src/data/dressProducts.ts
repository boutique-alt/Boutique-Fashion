import type { Product } from './products'

const IMG = (n: number) => `/images/dresses/${String(n).padStart(2, '0')}.png`

export const dressCategoryImage = IMG(1)

export const dressProducts: Product[] = [
  {
    id: 'op1',
    name: 'Purple Geometric Kaftan Dress',
    price: 2200,
    originalPrice: 2400,
    onSale: true,
    image: IMG(1),
    href: 'https://boutiquefashion.shop/product/purple-geometric-kaftan-dress/',
  },
  {
    id: 'op2',
    name: 'Rust Printed Kaftan Midi Dress',
    price: 2100,
    image: IMG(2),
    href: 'https://boutiquefashion.shop/product/rust-printed-kaftan-midi-dress/',
  },
]
