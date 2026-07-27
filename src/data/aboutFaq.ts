import { brand } from './navigation'
import { googleReviewsSummary } from './about'
import type { FaqItem } from './productFaq'
import { buildFaqSchema } from './productFaq'

export const aboutFaqs: FaqItem[] = [
  {
    question: 'Who is Boutique Fashion?',
    answer:
      'Boutique Fashion is a family-owned boutique in Kolkata, founded by Mahua in 2018. We specialise in premium sarees, bridal wear, dresses, kurta sets, and fabrics — combining comfort with craftsmanship.',
  },
  {
    question: 'Who founded Boutique Fashion?',
    answer:
      'Boutique Fashion was founded by Mahua, lead designer of the brand. She and the artisan team oversee hand-block printing, embroidery, and fabric sourcing for every collection.',
  },
  {
    question: 'Where is Boutique Fashion based?',
    answer: `Boutique Fashion is based in Garia, Kolkata at ${brand.address}. Store hours: ${brand.hours}.`,
  },
  {
    question: 'What do customers say about Boutique Fashion?',
    answer: `Boutique Fashion has a ${googleReviewsSummary.rating}-star rating from ${googleReviewsSummary.totalReviews} ${googleReviewsSummary.source} reviews, with customers praising fabric quality, fit, and personal service.`,
  },
]

export function buildAboutFaqSchema(faqs: FaqItem[] = aboutFaqs) {
  return buildFaqSchema(faqs)
}
