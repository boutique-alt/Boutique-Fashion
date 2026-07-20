const BF = 'https://boutiquefashion.shop/wp-content/uploads'

export const contactAssets = {
  banner: `${BF}/2022/01/breadcrumbs-woo.webp`,
  image: `${BF}/2022/09/contact-01.webp`,
}

export type ContactSectionId = 'returns' | 'policy' | 'care'

export interface ContactSection {
  id: ContactSectionId
  label: string
  title: string
  content: string[]
}

export const contactSections: ContactSection[] = [
  {
    id: 'returns',
    label: 'Return & Exchange a product',
    title: 'Return & Exchange a Product',
    content: [
      'We want you to love every piece from Boutique Fashion. If your order is not the right fit or style, you may request a return or exchange within 7 days of delivery.',
      'Items must be unused, unworn, with original tags and packaging intact. Custom-stitched or altered products are not eligible for return unless there is a manufacturing defect.',
      'To initiate a return or exchange, contact our customer care team with your order details. Once approved, we will guide you through pickup or self-ship instructions.',
      'Exchanges are subject to product availability. If the requested size or style is unavailable, a refund or store credit may be offered as per our policy.',
    ],
  },
  {
    id: 'policy',
    label: 'Return & Cancellation Policy',
    title: 'Return & Cancellation Policy',
    content: [
      'Orders may be cancelled before dispatch by contacting us as soon as possible. Once shipped, cancellation is not possible — please refer to our return process instead.',
      'Refunds for approved returns are processed within 7–10 business days after we receive and inspect the product. Refunds are issued to the original payment method where applicable.',
      'Cash on Delivery orders are refunded via bank transfer or store credit after verification.',
      'Shipping charges are non-refundable unless the return is due to a wrong, damaged, or defective item sent by Boutique Fashion.',
      'For any disputes or special cases, our team will review and respond within 48 business hours.',
    ],
  },
  {
    id: 'care',
    label: 'Customer Care',
    title: 'Customer Care',
    content: [
      'Our team is here to help with orders, styling advice, sizing queries, and after-sales support.',
      'Reach us by phone, email, or the form below — we aim to respond within 24 hours on business days.',
      'Visit our Kolkata showroom during store hours for in-person assistance and to explore our latest collections.',
    ],
  },
]
