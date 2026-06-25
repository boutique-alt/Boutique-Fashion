import type { Product } from './products'

const IMG = (n: number) => `/images/tops-pant-skirt/${String(n).padStart(2, '0')}.png`

export const topsPantSkirtCategoryImage = IMG(1)

export const topsPantSkirtProducts: Product[] = [
  {
    id: 'tps1',
    name: 'Black Satin Shirt with Blue Geometric Dhoti Skirt',
    price: 2400,
    image: IMG(1),
    href: 'https://boutiquefashion.shop/product/black-satin-shirt-blue-geometric-dhoti-skirt/',
  },
  {
    id: 'tps2',
    name: 'Black Shirt with Teal Geometric Dhoti Skirt',
    price: 2350,
    image: IMG(2),
    href: 'https://boutiquefashion.shop/product/black-shirt-teal-geometric-dhoti-skirt/',
  },
  {
    id: 'tps3',
    name: 'Green Blouse with Mustard Paisley Long Skirt',
    price: 2200,
    originalPrice: 2499,
    onSale: true,
    image: IMG(3),
    href: 'https://boutiquefashion.shop/product/green-blouse-mustard-paisley-long-skirt/',
  },
]
