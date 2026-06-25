export interface WatchAndBuyItem {
  id: string
  video: string
  poster: string
  productName: string
  price: number
  originalPrice?: number
  productImage: string
  href: string
}

const V = (n: number) => `/videos/watch-and-buy/${String(n).padStart(2, '0')}.mp4`

export const watchAndBuyHeading = 'Watch and Buy'

export const watchAndBuyVideos: WatchAndBuyItem[] = [
  {
    id: 'wb1',
    video: V(1),
    poster: '/images/kurta-coord/01.png',
    productName: 'Mustard Floral Kurta Set',
    price: 2499,
    originalPrice: 2999,
    productImage: '/images/kurta-coord/01.png',
    href: '/dress/two-piece',
  },
  {
    id: 'wb2',
    video: V(2),
    poster: '/images/kurta-coord/02.png',
    productName: 'Indigo Block Print Coord Set',
    price: 2199,
    productImage: '/images/kurta-coord/02.png',
    href: '/dress/two-piece',
  },
  {
    id: 'wb3',
    video: V(3),
    poster: '/images/blouse/01.png',
    productName: 'Silk Brocade Designer Blouse',
    price: 1899,
    originalPrice: 2299,
    productImage: '/images/blouse/01.png',
    href: '/blouse',
  },
  {
    id: 'wb4',
    video: V(4),
    poster: '/images/dresses/01.png',
    productName: 'Maroon Heritage Handblock Dress',
    price: 1599,
    productImage: '/images/dresses/01.png',
    href: '/dress/one-piece',
  },
  {
    id: 'wb5',
    video: V(5),
    poster: '/images/suit-set/01.png',
    productName: 'Elegant Three-Piece Suit Set',
    price: 3499,
    originalPrice: 3999,
    productImage: '/images/suit-set/01.png',
    href: '/three-piece',
  },
  {
    id: 'wb6',
    video: V(6),
    poster: '/images/kurta-coord/05.png',
    productName: 'Teal Floral Kurta Coord Set',
    price: 2299,
    productImage: '/images/kurta-coord/05.png',
    href: '/dress/two-piece',
  },
  {
    id: 'wb7',
    video: V(7),
    poster: '/images/mens/01.png',
    productName: 'Mustard Tie-Dye Cotton Shirt',
    price: 1200,
    productImage: '/images/mens/01.png',
    href: '/mens',
  },
  {
    id: 'wb8',
    video: V(8),
    poster: '/images/blouse/04.png',
    productName: 'Katan Silk Festive Blouse',
    price: 2100,
    originalPrice: 2499,
    productImage: '/images/blouse/04.png',
    href: '/blouse',
  },
  {
    id: 'wb9',
    video: V(9),
    poster: '/images/kurta-coord/08.png',
    productName: 'Rust Block Print Kurta Set',
    price: 1999,
    productImage: '/images/kurta-coord/08.png',
    href: '/dress/two-piece',
  },
  {
    id: 'wb10',
    video: V(10),
    poster: '/images/dresses/02.png',
    productName: 'Indigo Kaftan Midi Dress',
    price: 1799,
    productImage: '/images/dresses/02.png',
    href: '/dress/one-piece',
  },
  {
    id: 'wb11',
    video: V(11),
    poster: '/images/mens/11.png',
    productName: 'Rust Floral Handblock Shirt',
    price: 1300,
    originalPrice: 1699,
    productImage: '/images/mens/11.png',
    href: '/mens',
  },
  {
    id: 'wb12',
    video: V(12),
    poster: '/images/suit-set/06.png',
    productName: 'Festive Embroidered Suit Set',
    price: 3299,
    productImage: '/images/suit-set/06.png',
    href: '/three-piece',
  },
  {
    id: 'wb13',
    video: V(13),
    poster: '/images/tops-pant-skirt/01.png',
    productName: 'Indo-Western Top with Skirt',
    price: 1899,
    productImage: '/images/tops-pant-skirt/01.png',
    href: '/dress/tops-pant-skirt',
  },
]
