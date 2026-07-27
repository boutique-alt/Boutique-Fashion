import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const dressFaqs: FaqItem[] = [
  {
    question: 'What dress categories are available at Boutique Fashion?',
    answer:
      'Boutique Fashion offers dresses, kurta sets, coord sets, tops with pant, tops with skirt, and suit sets in premium fabrics.',
  },
  {
    question: 'Are Boutique Fashion dresses suitable for everyday wear?',
    answer:
      'Yes. Our dress collections are designed for comfort and style, making them suitable for both everyday use and special occasions.',
  },
  {
    question: 'How do I choose the right style from Boutique Fashion dress collections?',
    answer:
      'You can explore each dress sub-category page, compare product descriptions and fabric details, and contact Boutique Fashion for sizing or style guidance.',
  },
]

export function buildDressFaqSchema(faqs: FaqItem[] = dressFaqs) {
  return buildFaqSchema(faqs)
}
