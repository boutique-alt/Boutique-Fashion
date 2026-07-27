import { brand } from './navigation'
import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const bridalFaqs: FaqItem[] = [
  {
    question: 'What types of bridal wear does Boutique Fashion offer?',
    answer:
      'Boutique Fashion offers designer blouses, three-piece suit sets, and bridal sarees — crafted with Khadi embroidery, intricate handwork, and luxurious fabrics for weddings and grand celebrations.',
  },
  {
    question: 'Can I get a customised bridal outfit at Boutique Fashion?',
    answer:
      'Yes, we offer bespoke bridal outfits tailored to your requirements. Contact us via WhatsApp or email to discuss customisation. Please note that customised orders are not eligible for returns or exchanges.',
  },
  {
    question: 'How long does it take to receive a bridal order?',
    answer:
      'Bridal wear is made to order with artisanal precision. Dispatch typically takes 7-9 working days after the order, plus 2-5 days transit time depending on your location.',
  },
  {
    question: "Where is Boutique Fashion's bridal store located?",
    answer: `Our boutique is located at ${brand.address}. We are open ${brand.hours}.`,
  },
]

export function buildBridalFaqSchema(faqs: FaqItem[] = bridalFaqs) {
  return buildFaqSchema(faqs)
}
