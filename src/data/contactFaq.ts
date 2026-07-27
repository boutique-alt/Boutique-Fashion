import { brand } from './navigation'
import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const contactFaqs: FaqItem[] = [
  {
    question: 'What are Boutique Fashion store hours?',
    answer: `Boutique Fashion is open every day from 9:00 AM to 8:00 PM (${brand.hours}).`,
  },
  {
    question: 'Where is Boutique Fashion located?',
    answer: `Boutique Fashion is located at ${brand.address}.`,
  },
  {
    question: 'How can I contact Boutique Fashion?',
    answer: `You can contact Boutique Fashion by phone at ${brand.phone} or by email at ${brand.email}.`,
  },
]

export function buildContactFaqSchema(faqs: FaqItem[] = contactFaqs) {
  return buildFaqSchema(faqs)
}
