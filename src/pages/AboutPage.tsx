import PageBanner from '../components/layout/PageBanner'
import AboutFamilyPhoto from '../components/about/AboutFamilyPhoto'
import AboutStory from '../components/about/AboutStory'
import AboutTimeline from '../components/about/AboutTimeline'
import AboutComfort from '../components/about/AboutComfort'
import GoogleReviews from '../components/about/GoogleReviews'
import { aboutAssets } from '../data/about'

export default function AboutPage() {
  return (
    <main>
      <PageBanner
        title="About Us"
        image={aboutAssets.hero}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
      />
      <AboutFamilyPhoto />
      <AboutStory />
      <AboutTimeline />
      <AboutComfort />
      <GoogleReviews />
    </main>
  )
}
