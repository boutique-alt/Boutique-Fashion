import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { FaqItem } from '../../data/productFaq'

interface FaqAccordionProps {
  faqs: FaqItem[]
  title?: string
}

export default function FaqAccordion({ faqs, title = 'Frequently Asked Questions' }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="border-t border-accent bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="mb-8 text-center font-serif text-2xl font-medium text-charcoal md:text-3xl">
          {title}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="border border-accent/60 bg-accent/40">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#FAF7F7]"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-maroon">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="shrink-0 text-maroon" />
                  ) : (
                    <ChevronDown size={18} className="shrink-0 text-maroon" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-accent/40 px-4 py-3.5">
                    <p className="text-[14px] leading-relaxed text-charcoal/75">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
