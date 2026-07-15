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
      
      <section className="bg-cream px-4 py-8 md:px-8 md:py-10 lg:px-12">
        <div className="overflow-hidden border border-accent/60 p-1 md:p-1.5">
          <img
            src="/images/about/team-hero.png"
            alt="The Boutique Fashion family — generations of craftsmanship and style"
            className="h-[220px] w-full object-cover object-[center_42%] sm:h-[280px] md:h-[340px] lg:h-[540px]"
            loading="lazy"
          />
        </div>
      </section>

      <AboutComfort />
      <GoogleReviews />
    </main>
  )
}
