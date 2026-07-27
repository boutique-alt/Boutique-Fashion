import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const shopFaqs: FaqItem[] = [
  {
    question: 'What types of clothing does Boutique Fashion sell?',
    answer:
      'Boutique Fashion offers premium sarees, dresses, kurta sets, coord sets, tops with pant or skirt, suit sets, blouses, bridal wear, men\'s fashion, and fabric — crafted with pure cotton, Chanderi, Katan silk, and handloom fabrics.',
  },
  {
    question: 'Does Boutique Fashion deliver across India?',
    answer:
      'Yes. Boutique Fashion delivers pan-India. Orders are dispatched within 7-9 working days (made to order) with 2-5 days transit time. Cash on Delivery (COD) is also available.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Yes. Boutique Fashion offers 3-day no-questions-asked returns and exchanges with free pickup, valid for unused products with tags. Customised and international orders are not eligible.',
  },
]

export function buildShopFaqSchema(faqs: FaqItem[] = shopFaqs) {
  return buildFaqSchema(faqs)
}
