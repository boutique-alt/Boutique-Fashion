import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const fabricFaqs: FaqItem[] = [
  {
    question: 'Which fabrics are available at Boutique Fashion?',
    answer:
      'Boutique Fashion offers pure cotton, handloom, Chanderi, Modal, Katan silk, brocade, handblock prints, and Khadi embroidery fabrics.',
  },
  {
    question: 'Are Boutique Fashion fabrics suitable for daily and occasion wear?',
    answer:
      'Yes. Our fabrics are selected for breathability, comfort, durability, and premium finish, making them suitable for both daily wear and special occasions.',
  },
  {
    question: 'Can I shop fabric products online from Boutique Fashion?',
    answer:
      'Yes. You can browse and shop fabric products directly online from the Boutique Fashion fabric collection page.',
  },
]

export function buildFabricFaqSchema(faqs: FaqItem[] = fabricFaqs) {
  return buildFaqSchema(faqs)
}
