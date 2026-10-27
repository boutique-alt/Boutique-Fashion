import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const fabricFaqs: FaqItem[] = [
  {
    question: 'Where can I find pure handloom and breathable cotton fabrics in Kolkata?',
    answer:
      'Boutique Fashion in Garia, Kolkata is a premier destination for 100% pure combed cotton, hand-spun Khadi, Chanderi, and artisanal Bengal handlooms. All fabrics are breathable, pre-treated for skin comfort, and dyed with eco-friendly pigments.',
  },
  {
    question: 'Which fabrics are available at Boutique Fashion?',
    answer:
      'Boutique Fashion offers pure cotton, authentic Bengal handloom, Chanderi silk, Modal, Katan silk, brocade, traditional handblock prints, and delicate Khadi embroidery fabrics.',
  },
  {
    question: 'Are Boutique Fashion fabrics suitable for daily and occasion wear?',
    answer:
      'Yes. Our fabrics are selected for breathability, comfort, durability, and premium finish, making them suitable for both daily wear and special occasions.',
  },
  {
    question: 'How do I care for pure handloom and silk fabrics purchased from Boutique Fashion?',
    answer:
      'We recommend dry cleaning for silk and brocade garments, and gentle hand-washing in cold water with mild liquid detergent for pure cotton and modal pieces to ensure lifelong fabric vibrancy.',
  },
  {
    question: 'Can I shop fabric products online from Boutique Fashion?',
    answer:
      'Yes. You can browse and shop fabric products directly online from the Boutique Fashion fabric collection page with pan-India delivery.',
  },
]

export function buildFabricFaqSchema(faqs: FaqItem[] = fabricFaqs) {
  return buildFaqSchema(faqs)
}
