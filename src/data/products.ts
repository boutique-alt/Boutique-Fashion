const BF = 'https://boutiquefashion.shop/wp-content/uploads'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  href?: string
  isNew?: boolean
  onSale?: boolean
}

const onePiece: Product[] = [
  { id: 'op1', name: 'Maroon Heritage Handblock Cotton Midi Dress', price: 1750, image: `${BF}/2026/03/Handblock-Pure-Cotton-Maroon-One-Piece-480x638.png`, href: 'https://boutiquefashion.shop/product/maroon-heritage-handblock-cotton-midi-dress/' },
  { id: 'op2', name: 'White Floral Khadi Embroidery Dress', price: 1799, image: `${BF}/2026/03/Embroidery-dress-480x638.png`, href: 'https://boutiquefashion.shop/product/white-khadi-embroidery-dress/' },
  { id: 'op3', name: 'Blue Halter Neck Cotton Dress', price: 1599, image: `${BF}/2026/03/blue-halter-neck-dress-480x638.png`, href: 'https://boutiquefashion.shop/product/blue-halter-neck-cotton-dress/' },
  { id: 'op4', name: 'White Begumpuri Long A-line Dress', price: 1800, image: `${BF}/2026/03/Begumpuri-one-piece-480x638.png`, href: 'https://boutiquefashion.shop/product/white-begumpuri-long-a-line-dress/' },
  { id: 'op5', name: 'Pure Modal Kaftaan Purple Dress', price: 2200, originalPrice: 2400, onSale: true, image: `${BF}/2026/03/Pure-Modal-Kaftan-Dress-Purple-480x638.png`, href: 'https://boutiquefashion.shop/product/pure-modal-kaftaan-purple-dress/' },
  { id: 'op6', name: 'Pure Modal Light Brown Handblock Kaftaan Dress', price: 2200, originalPrice: 2400, onSale: true, image: `${BF}/2026/03/Pure-Modal-Kaftan-Dress-Purple-Light-Brown-480x638.png`, href: 'https://boutiquefashion.shop/product/pure-modal-light-brown-handblock-kaftaan-dress/' },
  { id: 'op7', name: 'Dhonekhali Pure Handloom Heritage Cotton Dress', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/Dhonekhali-white-orange-480x638.png`, href: 'https://boutiquefashion.shop/product/dhonekhali-pure-handloom-heritage-cotton-dress/' },
  { id: 'op8', name: 'Dhonekhali Grey & Maroon Handwoven Cotton Dress', price: 2400, originalPrice: 2699, onSale: true, image: `${BF}/2026/03/Dhonekhali-grey-maroon-480x638.png`, href: 'https://boutiquefashion.shop/product/dhonekhali-grey-maroon-handwoven-cotton-dress/' },
]

const twoPiece: Product[] = [
  { id: 'tp1', name: 'Cotton Handblock Braided Sleeve Kurti Set', price: 1200, image: `${BF}/2026/03/Ajrakh-Light-pink-braid-sleeve-kurti-480x638.png`, href: 'https://boutiquefashion.shop/product/cotton-handblock-braided-sleeve-kurti-set/' },
  { id: 'tp2', name: 'Chanderi Silk Handpainted Inner & Shrug Set', price: 1800, originalPrice: 2100, onSale: true, image: `${BF}/2026/03/Teal-inner-shrug-480x638.png`, href: 'https://boutiquefashion.shop/product/teal-green-handpainted-inner-shrug-chanderi-silk/' },
]

const blouse: Product[] = [
  { id: 'bl1', name: 'Baluchori Katan Silk Designer Blouse', price: 2300, image: `${BF}/2026/03/blouse1-1-480x638.png`, href: 'https://boutiquefashion.shop/product/blue-designer-silk-blouse-with-back-design/' },
  { id: 'bl2', name: 'Brocade Designer Sweetheart Neck Blouse', price: 2300, image: `${BF}/2026/03/blouse2-1-480x638.png`, href: 'https://boutiquefashion.shop/product/brocade-designer-sweetheart-neck-blouse/' },
  { id: 'bl3', name: 'Katan Silk Wedding Designer Blouse', price: 1800, originalPrice: 2100, onSale: true, image: `${BF}/2026/03/blouse3-1-480x638.png`, href: 'https://boutiquefashion.shop/product/maroon-luxury-wedding-designer-blouse/' },
  { id: 'bl4', name: 'Royal Katan Silk Designer Blouse with Scallop Detailing', price: 2800, originalPrice: 3500, onSale: true, image: `${BF}/2026/03/blouse-4-480x638.png`, href: 'https://boutiquefashion.shop/product/peach-sea-waves-designer-blouse/' },
]

const mens: Product[] = [
  { id: 'm1', name: 'Black Abstract Handblock Cotton Shirt', price: 1400, originalPrice: 1699, onSale: true, image: `${BF}/2026/04/Black-Abstract-motif-handblock-shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/black-abstract-handblock-cotton-shirt/' },
  { id: 'm2', name: 'Indigo Handblock Cotton Shirt', price: 1050, originalPrice: 1399, onSale: true, image: `${BF}/2026/04/Indigo-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/indigo-handblock-cotton-shirt/' },
  { id: 'm3', name: 'Forest-Inspired Tiger Handblock Print Shirt', price: 1300, originalPrice: 1699, onSale: true, image: `${BF}/2026/04/Tiger-motif-handblock-forest-shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/forest-inspired-tiger-handblock-print-shirt/' },
  { id: 'm4', name: 'Classic Maroon Square Motif Cotton Shirt', price: 1200, originalPrice: 1499, onSale: true, image: `${BF}/2026/04/Maroon-Square-pattern-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/classic-maroon-square-motif-cotton-shirt/' },
  { id: 'm5', name: 'Brown Bagru Handblock Shirt', price: 999, originalPrice: 1100, onSale: true, image: `${BF}/2026/04/Brown-Bagru-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/brown-bagru-handblock-shirt/' },
  { id: 'm6', name: 'Cheetah Motif Handblock Cotton Shirt', price: 1200, image: `${BF}/2026/04/Cheetah-Handblock-Shirt-480x638.png`, href: 'https://boutiquefashion.shop/product/elephant-motif-white-handblock-shirt/' },
  { id: 'm7', name: 'Cotton Bagru Handblock Mauve Shirt', price: 1200, originalPrice: 1499, onSale: true, image: `${BF}/2026/04/Pink-bagru-handblock-480x638.png`, href: 'https://boutiquefashion.shop/product/cotton-bagru-handblock-mauve-shirt/' },
  { id: 'm8', name: "Handblock Fish Motif Men's Shirt", price: 899, image: `${BF}/2026/03/Crimson-red-Handblock-Fish-Motif-480x638.png`, href: 'https://boutiquefashion.shop/product/premium-cotton-handblock-fish-motif-shirt-for-men-breathable-ethnic-casual-wear/' },
]

export const bestSellerProducts: Record<string, Product[]> = {
  'ONE PIECE': onePiece,
  'TWO PIECE': twoPiece,
  BLOUSE: blouse,
}

export const exclusiveCollectionProducts: Product[] = [
  onePiece[0],
  twoPiece[0],
  onePiece[1],
  onePiece[2],
  onePiece[3],
  onePiece[4],
  onePiece[5],
  twoPiece[1],
]

export const mensCollectionProducts: Product[] = mens

const M3 = `${BF}/2026/03`

export interface HeroSlide {
  tag: string
  title: string
  subtitle: string
  description?: string
  image: string
  cta: string
  href: string
  bgColor: string
  objectPosition?: string
}

export const heroSlides: HeroSlide[] = [
  {
    tag: 'Summer Collections',
    title: 'Premium Summer Kurtis &',
    subtitle: 'Indo-Western Collection',
    description:
      'Discover breathable summer kurtis, elegant indo-western outfits, and ready-to-wear sarees designed for modern women.',
    image: `${M3}/prod-1-1.png`,
    cta: 'Explore Collection',
    href: '/dress/one-piece',
    bgColor: '#e8d9d0',
  },
  {
    tag: 'Summer Collections',
    title: 'Refined Menswear &',
    subtitle: 'Handblock Shirts',
    description:
      'Premium cotton shirts with artisanal handblock prints — crafted for comfort, character, and everyday elegance.',
    image: `${M3}/hero-scaled.png`,
    cta: 'View Collection',
    href: '/mens',
    bgColor: '#e8d9d0',
    objectPosition: 'center top',
  },
]

export const features = [
  { title: 'Uniqueness', text: 'Our collections reflect modern fashion.' },
  { title: 'Delivery', text: 'Free Delivery all across India' },
  { title: 'Quality', text: 'We deliver products with high quality fabrics' },
  { title: 'Showroom', text: 'You can see our latest collection here' },
]

export const instagramPosts = [
  { id: 1, caption: 'Grace never goes out of style', image: `${BF}/2026/03/prod-2.png` },
  { id: 2, caption: 'Elegance woven with tradition', image: `${BF}/2026/03/1.png` },
  { id: 3, caption: 'Sophisticated craftsmanship meets everyday elegance', image: `${BF}/2026/03/3.png` },
  { id: 4, caption: 'Elegance in Every Thread', image: `${BF}/2026/03/4.png` },
  { id: 5, caption: 'Sunshine, style, and timeless elegance', image: `${BF}/2026/03/home-ban-2.png` },
  { id: 6, caption: 'Heritage meets contemporary', image: `${BF}/2026/03/Handblock-Pure-Cotton-Maroon-One-Piece-480x638.png` },
]

export const categoryCards = [
  { label: 'Dresses', count: 9, image: `${BF}/2026/03/1.png`, href: '/dress/one-piece' },
  { label: 'Kurta Set / Coord Set', count: 3, image: `${BF}/2026/03/3.png`, href: '/dress/two-piece' },
  { label: 'Blouse', count: 4, image: `${BF}/2026/03/4.png`, href: '/blouse' },
  { label: "Men's", count: 8, image: `${BF}/2026/03/men.png`, href: '/mens' },
]

export const brandAssets = {
  logo: `${BF}/2026/02/Boutique-Fashion_-New-Logo_V4.png`,
  newArrivalsBanner: `${BF}/2026/03/home-ban-2.png`,
  mensExclusiveBanner: `${BF}/2026/03/men.png`,
}
