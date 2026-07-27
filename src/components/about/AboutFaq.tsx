import FaqAccordion from '../ui/FaqAccordion'
import { aboutFaqs } from '../../data/aboutFaq'

export default function AboutFaq() {
  return <FaqAccordion faqs={aboutFaqs} />
}
