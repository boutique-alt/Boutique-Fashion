export const reviewGalleryImages = Array.from({ length: 12 }, (_, i) => ({
  id: `gallery-${i + 1}`,
  src: `/images/reviews/review-${i + 1}.png`,
  alt: `Happy customers at Boutique Fashion expo and showroom ${i + 1}`,
}))

export interface CustomerReview {
  id: string
  name: string
  location: string
  headline: string
  text: string
  rating: number
}

export const customerReviews: CustomerReview[] = [
  {
    id: '1',
    name: 'Ananya R.',
    location: 'Kolkata, India',
    headline: 'Absolutely loved the quality!',
    text: 'Beautiful quality and perfect stitching! Ordered a kurta set for a family function and received so many compliments. Will definitely order again.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Meera K.',
    location: 'Bangalore, India',
    headline: 'Premium fabrics, perfect fit',
    text: 'Great experience from ordering to delivery. The fabric feels premium and the fit was exactly as described. Highly recommend Boutique Fashion.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sneha P.',
    location: 'Mumbai, India',
    headline: 'Elegant and beautifully crafted',
    text: 'Loved my bridal outfit! The team kept me updated throughout. The final product was absolutely worth the wait — stunning detailing.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Divya S.',
    location: 'Hyderabad, India',
    headline: 'Custom stitching at its best',
    text: 'Custom stitching service is excellent. They understood exactly what I wanted and the outfit fit like it was made for me.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Kavita M.',
    location: 'Pune, India',
    headline: 'Best boutique in town',
    text: 'Best online boutique I have found. Good prices, genuine products, and very responsive customer care. Five stars!',
    rating: 5,
  },
  {
    id: '6',
    name: 'Ritu A.',
    location: 'Delhi, India',
    headline: 'Elegant designs, on-time delivery',
    text: 'Ordered a suit set for my husband — great quality and elegant design. Packaging was neat and delivery was on time.',
    rating: 4,
  },
  {
    id: '7',
    name: 'Priya M.',
    location: 'Chennai, India',
    headline: 'Family-run warmth you can feel',
    text: 'Visiting the Garia showroom felt like shopping with family. Warm service, beautiful sarees, and honest guidance on what suits you best.',
    rating: 5,
  },
  {
    id: '8',
    name: 'Shreya B.',
    location: 'Kolkata, India',
    headline: 'Comfort meets confidence',
    text: 'The coord set I bought is so comfortable for daily wear yet looks festive enough for gatherings. Exactly what their tagline promises.',
    rating: 5,
  },
]
