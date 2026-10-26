export interface FaqItem {
  question: string
  answer: string
}

export const productFaqs: FaqItem[] = [
  {
    question: 'How long does it take to dispatch my order?',
    answer:
      'All products are made to order. We typically dispatch orders 7-9 working days after placement, and transit time varies from 2-5 days depending on the destination.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes. Cash on Delivery (COD) is available. Before delivery & alteration, full payment is required.',
  },
  {
    question: 'What is your return & exchange policy?',
    answer:
      'Returns/Exchanges are allowed for 3 days no-questions-asked, with free pickup. Exchanges are not limited to size adjustments and can be offered on any product. International/customized orders are not eligible. Returns/Exchanges are allowed only for unused products with tags.',
  },
  {
    question: 'How should I care for my saree?',
    answer:
      'Hand wash in cold water with a mild detergent. Dry clean is recommended for sarees. Wash inside out to prevent fading. Iron on low heat while avoiding embellishments, painting, or embroidery.',
  },
  {
    question: 'Are Boutique Fashion products made from 100% authentic and sustainable fabrics?',
    answer:
      'Yes. Boutique Fashion uses 100% authentic handloom silks, certified pure cotton, Chanderi, and organza woven by skilled Indian artisans using sustainable, skin-friendly dyes.',
  },
  {
    question: 'Can I get custom sizing or alterations for my boutique dress or blouse?',
    answer:
      'Yes, we provide customization and size alterations. Simply contact our support on WhatsApp at +91-8334816333 right after placing your order with your specific measurements.',
  },

]

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildProductFaqSchema(faqs: FaqItem[] = productFaqs) {
  return buildFaqSchema(faqs)
}
