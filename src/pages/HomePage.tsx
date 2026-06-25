import Hero from '../components/sections/Hero'
import SummerSale from '../components/sections/SummerSale'
import CeremonialEdit from '../components/sections/CeremonialEdit'
import ShopByCategory from '../components/sections/ShopByCategory'
import CelebrateWithUs from '../components/sections/CelebrateWithUs'
import WatchAndBuy from '../components/sections/WatchAndBuy'
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
      <CeremonialEdit />
      <ShopByCategory />
      <WatchAndBuy />
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
