import AboutFamilyPhoto from '../components/about/AboutFamilyPhoto'
import AboutStory from '../components/about/AboutStory'
import AboutTimeline from '../components/about/AboutTimeline'
import AboutComfort from '../components/about/AboutComfort'
import GoogleReviews from '../components/about/GoogleReviews'
import SEO from '../components/ui/SEO'

export default function AboutPage() {
  return (
    <main>
      <SEO title="About Us" description="Learn more about Boutique Fashion's heritage, our family story, and our commitment to premium craftsmanship." />
      <AboutFamilyPhoto />
      <AboutStory />
      <AboutTimeline />
      <AboutComfort />
      <GoogleReviews />
    </main>
  )
}
