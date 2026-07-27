import FaqAccordion from '../ui/FaqAccordion'
import { productFaqs } from '../../data/productFaq'

export default function ProductFaq() {
  return <FaqAccordion faqs={productFaqs} />
}
