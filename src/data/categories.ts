import type { Product } from './products'

const BF = 'https://boutiquefashion.shop/wp-content/uploads'

export interface CategoryConfig {
  slug: string
  title: string
  description: string
  count: number
  products: Product[]
  parent: { label: string; href: string }
}

const onePiece: Product[] = [
  { id: 'op1', name: 'Blue Halter Neck Cotton Dress', price: 1599, image: `${BF}/2026/03/blue-halter-neck-dress-480x638.png`, href: 'https://boutiquefashion.shop/product/blue-halter-neck-cotton-dress/' },
  { id: 'op2', name: 'Dhonekhali Grey & Maroon Handwoven Cotton Dress', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/Dhonekhali-grey-maroon-480x638.png`, href: 'https://boutiquefashion.shop/product/dhonekhali-grey-maroon-handwoven-cotton-dress/' },
  { id: 'op3', name: 'Dhonekhali Pure Cotton Black & White Dress', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/Dhonekhali-black-white-480x638.png`, href: 'https://boutiquefashion.shop/product/dhonekhali-pure-cotton-black-white-dress-handloom-heritage/' },
  { id: 'op4', name: 'Dhonekhali Pure Handloom Heritage Cotton Dress', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/Dhonekhali-white-orange-480x638.png`, href: 'https://boutiquefashion.shop/product/dhonekhali-pure-handloom-heritage-cotton-dress/' },
  { id: 'op5', name: 'Maroon Heritage Handblock Cotton Midi Dress', price: 1750, image: `${BF}/2026/03/Handblock-Pure-Cotton-Maroon-One-Piece-480x638.png`, href: 'https://boutiquefashion.shop/product/maroon-heritage-handblock-cotton-midi-dress/' },
  { id: 'op6', name: 'Pure Modal Kaftaan Purple Dress', price: 2200, originalPrice: 2400, onSale: true, image: `${BF}/2026/03/Pure-Modal-Kaftan-Dress-Purple-480x638.png`, href: 'https://boutiquefashion.shop/product/pure-modal-kaftaan-purple-dress/' },
  { id: 'op7', name: 'Pure Modal Light Brown Handblock Kaftaan Dress', price: 2200, originalPrice: 2400, onSale: true, image: `${BF}/2026/03/Pure-Modal-Kaftan-Dress-Purple-Light-Brown-480x638.png`, href: 'https://boutiquefashion.shop/product/pure-modal-light-brown-handblock-kaftaan-dress/' },
  { id: 'op8', name: 'White Begumpuri Long A-line Dress', price: 1800, image: `${BF}/2026/03/Begumpuri-one-piece-480x638.png`, href: 'https://boutiquefashion.shop/product/white-begumpuri-long-a-line-dress/' },
  { id: 'op9', name: 'White Floral Khadi Embroidery Dress', price: 1799, image: `${BF}/2026/03/Embroidery-dress-480x638.png`, href: 'https://boutiquefashion.shop/product/white-khadi-embroidery-dress/' },
]

const twoPiece: Product[] = [
  { id: 'tp1', name: 'Chanderi Silk Handpainted Inner & Shrug Set', price: 1800, originalPrice: 2100, onSale: true, image: `${BF}/2026/03/Teal-inner-shrug-480x638.png`, href: 'https://boutiquefashion.shop/product/teal-green-handpainted-inner-shrug-chanderi-silk/' },
  { id: 'tp2', name: 'Cotton Handblock Braided Sleeve Kurti Set', price: 1200, image: `${BF}/2026/03/Ajrakh-Light-pink-braid-sleeve-kurti-480x638.png`, href: 'https://boutiquefashion.shop/product/cotton-handblock-braided-sleeve-kurti-set/' },
  { id: 'tp3', name: 'Elegant White Embroidered Bafta Silk Coord Set', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/White-Coord-Set-480x638.png`, href: 'https://boutiquefashion.shop/product/5630/' },
]

const mens: Product[] = [
  { id: 'm1', name: 'Black Abstract Handblock Cotton Shirt', price: 1400, originalPrice: 1699, onSale: true, image: `${BF}/2026/04/Black-Abstract-motif-handblock-shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/black-abstract-handblock-cotton-shirt/' },
  { id: 'm2', name: 'Brown Bagru Handblock Shirt', price: 999, originalPrice: 1100, onSale: true, image: `${BF}/2026/04/Brown-Bagru-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/brown-bagru-handblock-shirt/' },
  { id: 'm3', name: 'Cheetah Motif Handblock Cotton Shirt', price: 1200, image: `${BF}/2026/04/Cheetah-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/elephant-motif-white-handblock-shirt/' },
  { id: 'm4', name: 'Classic Maroon Square Motif Cotton Shirt', price: 1200, originalPrice: 1499, onSale: true, image: `${BF}/2026/04/Maroon-Square-pattern-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/classic-maroon-square-motif-cotton-shirt/' },
  { id: 'm5', name: 'Cotton Bagru Handblock Mauve Shirt', price: 1200, originalPrice: 1499, onSale: true, image: `${BF}/2026/04/Pink-bagru-handblock-480x638.png`, href: 'https://boutiquefashion.shop/product/cotton-bagru-handblock-mauve-shirt/' },
  { id: 'm6', name: 'Forest-Inspired Tiger Handblock Print Shirt', price: 1300, originalPrice: 1699, onSale: true, image: `${BF}/2026/04/Tiger-motif-handblock-forest-shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/forest-inspired-tiger-handblock-print-shirt/' },
  { id: 'm7', name: "Handblock Fish Motif Men's Shirt", price: 899, image: `${BF}/2026/03/Crimson-red-Handblock-Fish-Motif-480x638.png`, href: 'https://boutiquefashion.shop/product/premium-cotton-handblock-fish-motif-shirt-for-men-breathable-ethnic-casual-wear/' },
  { id: 'm8', name: 'Indigo Handblock Cotton Shirt', price: 1050, originalPrice: 1399, onSale: true, image: `${BF}/2026/04/Indigo-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/indigo-handblock-cotton-shirt/' },
]

const blouse: Product[] = [
  { id: 'bl1', name: 'Baluchori Katan Silk Designer Blouse', price: 2300, image: `${BF}/2026/03/blouse1-1-480x638.png`, href: 'https://boutiquefashion.shop/product/blue-designer-silk-blouse-with-back-design/' },
  { id: 'bl2', name: 'Brocade Designer Sweetheart Neck Blouse', price: 2300, image: `${BF}/2026/03/blouse2-1-480x638.png`, href: 'https://boutiquefashion.shop/product/brocade-designer-sweetheart-neck-blouse/' },
  { id: 'bl3', name: 'Katan Silk Wedding Designer Blouse', price: 1800, originalPrice: 2100, onSale: true, image: `${BF}/2026/03/blouse3-1-480x638.png`, href: 'https://boutiquefashion.shop/product/maroon-luxury-wedding-designer-blouse/' },
  { id: 'bl4', name: 'Royal Katan Silk Designer Blouse with Scallop Detailing', price: 2800, originalPrice: 3500, onSale: true, image: `${BF}/2026/03/blouse-4-480x638.png`, href: 'https://boutiquefashion.shop/product/peach-sea-waves-designer-blouse/' },
]

const threePiece: Product[] = [
  { id: 'th1', name: 'Olive Green Mul Chanderi Boolean Work Three Piece Set', price: 2700, originalPrice: 3200, onSale: true, image: `${BF}/2026/04/Olive-Green-Mul-Chanderi-Boolean-Work-Three-Piece-Set-480x638.png`, href: 'https://boutiquefashion.shop/product/olive-green-mul-chanderi-boolean-work-three-piece-set/' },
]

export const allCategories: CategoryConfig[] = [
  {
    slug: 'one-piece',
    title: 'Dresses',
    description: 'Elegant dresses crafted with premium fabrics and artisanal details.',
    count: 9,
    products: onePiece,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'two-piece',
    title: 'Kurta Set / Coord Set',
    description: 'Coordinated kurta sets and coord sets for effortless ethnic elegance.',
    count: 3,
    products: twoPiece,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'tops-pant-skirt',
    title: 'Tops with Pant / Skirt',
    description: 'Stylish tops paired with pants and skirts for versatile everyday and festive looks.',
    count: 3,
    products: twoPiece,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'mens',
    title: "Men's",
    description: 'Premium ethnic and contemporary shirts designed for modern men with timeless taste.',
    count: 8,
    products: mens,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'blouse',
    title: 'Blouse',
    description: 'Designer blouses crafted in katan silk and brocade for weddings and celebrations.',
    count: 4,
    products: blouse,
    parent: { label: 'Collection', href: '/dress' },
  },
  {
    slug: 'three-piece',
    title: 'Suit Set',
    description: 'Elegant suit sets with artisanal detailing for festive occasions.',
    count: 1,
    products: threePiece,
    parent: { label: 'Collection', href: '/dress' },
  },
]

export const dressCategories = allCategories.filter((c) =>
  c.slug === 'one-piece' || c.slug === 'two-piece' || c.slug === 'tops-pant-skirt',
)

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return allCategories.find((c) => c.slug === slug)
}

export const collectionLandingCategories = allCategories.filter((c) =>
  ['mens', 'blouse', 'three-piece'].includes(c.slug),
)
