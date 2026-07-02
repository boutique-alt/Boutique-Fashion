import Hero from '../components/sections/Hero'
import SummerSale from '../components/sections/SummerSale'
import NewArrival from '../components/sections/NewArrival'
import CeremonialEdit from '../components/sections/CeremonialEdit'
import ShopByCategory from '../components/sections/ShopByCategory'
import CelebrateWithUs from '../components/sections/CelebrateWithUs'
import ExclusiveCollections from '../components/sections/ExclusiveCollections'
import OfficeWear from '../components/sections/OfficeWear'
import ExclusiveSarees from '../components/sections/ExclusiveSarees'
import CelebsCorner from '../components/sections/CelebsCorner'
import CustomerReviewGallery from '../components/sections/CustomerReviewGallery'
import CustomerReviews from '../components/sections/CustomerReviews'
import InTheNews from '../components/sections/InTheNews'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SummerSale />
      <NewArrival />
      <CeremonialEdit />
      <ShopByCategory />
      <CelebrateWithUs />
      <ExclusiveCollections />
      <OfficeWear />
      <ExclusiveSarees />
      <CustomerReviewGallery />
      <CustomerReviews />
      <CelebsCorner />
      <InTheNews />
    </main>
  )
}
