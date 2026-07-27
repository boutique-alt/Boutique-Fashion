import FaqAccordion from '../ui/FaqAccordion'
import { contactFaqs } from '../../data/contactFaq'

export default function ContactFaq() {
  return <FaqAccordion faqs={contactFaqs} />
}
