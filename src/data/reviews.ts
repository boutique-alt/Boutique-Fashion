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
    name: 'SUCHISMITA MAHALA',
    location: 'Kolkata, India',
    headline: 'Amazing doorstep delivery experience',
    text: 'Had an amazing experience shopping with them. They had a door step delivery in Kolkata. I got two sets at affordable prices.',
    rating: 5,
  },
  {
    id: '2',
    name: 'AYAN CHATTERJEE',
    location: 'Kolkata, India',
    headline: 'Pure cotton, highly recommendable',
    text: 'The shirt I purchased was of great Quality. The fabric was pure cotton and very breathable. The owner\'s behavior was so good. Highly recommendable.',
    rating: 5,
  },
  {
    id: '3',
    name: 'SUDESHNA MUKHERJEE',
    location: 'Kolkata, India',
    headline: 'Trendy designs and warm service',
    text: 'Good quality and trendy design attract me to buy from this boutique. A heart warming behaviour of Mahua is adding an extra spoon of sugar to make me visit it again. Overall everything is excellent.',
    rating: 5,
  },
  {
    id: '4',
    name: 'samita dey',
    location: 'Kolkata, India',
    headline: 'Perfect blouse fittings',
    text: 'Stitched some blouses....amazing fittings and reasonable charges...moreover Mahua was always there with her smile and suggestions..thank you so much',
    rating: 5,
  },
  {
    id: '5',
    name: 'Shibani Mondal',
    location: 'Kolkata, India',
    headline: 'Wonderful variety and fabric quality',
    text: 'Ami sari, shirt, dress, skirt onek kichhu kinechi ei boutique theke, kaporer quality sotti valo, sobaike bolbo Boutique Fashion theke ekbar jama banie dekho. Prottek ta jama pochondo soi',
    rating: 5,
  },
  {
    id: '6',
    name: 'Tirthendu Chakraborty',
    location: 'Kolkata, India',
    headline: 'Large variety, reasonable prices',
    text: 'Large variety of collection very reasonable prices. I will highly recommend Boutique fashion to everyone',
    rating: 5,
  },
  {
    id: '7',
    name: 'Soma Banerjee',
    location: 'Kolkata, India',
    headline: 'Unique tailor-made blouse designs',
    text: 'Liked the blouse collection of this boutique.  Very unique tailor made designs',
    rating: 5,
  },
  {
    id: '8',
    name: 'Sanchari Chatterjee',
    location: 'Kolkata, India',
    headline: 'Unique collection, amazing quality',
    text: 'Very  unique   collection and quality is amazing.',
    rating: 5,
  },
  {
    id: '9',
    name: 'kakoli sircar',
    location: 'Kolkata, India',
    headline: 'Unmatched dress variety',
    text: 'Boutique Fashion er dress er tulna nei, variety design er dress paua jai, ami satisfied. Mahua behavior Khub valo.',
    rating: 5,
  },
  {
    id: '10',
    name: 'Saswati Chatterjee',
    location: 'Kolkata, India',
    headline: 'Unique quality and perfect fit',
    text: 'Unique quality and design of the clothing, and the perfect fit',
    rating: 5,
  },
]
