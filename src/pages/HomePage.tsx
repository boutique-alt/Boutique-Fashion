import Hero from '../components/sections/Hero'
import SummerSale from '../components/sections/SummerSale'
import CeremonialEdit from '../components/sections/CeremonialEdit'
import ShopByCategory from '../components/sections/ShopByCategory'
import CelebrateWithUs from '../components/sections/CelebrateWithUs'
import ExclusiveCollections from '../components/sections/ExclusiveCollections'
import OfficeWear from '../components/sections/OfficeWear'
import ExclusiveSarees from '../components/sections/ExclusiveSarees'
import CelebsCorner from '../components/sections/CelebsCorner'
import InTheNews from '../components/sections/InTheNews'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SummerSale />
      <CeremonialEdit />
      <ShopByCategory />
      <CelebrateWithUs />
      <ExclusiveCollections />
      <OfficeWear />
      <ExclusiveSarees />
      <CelebsCorner />
      <InTheNews />
    </main>
  )
}
