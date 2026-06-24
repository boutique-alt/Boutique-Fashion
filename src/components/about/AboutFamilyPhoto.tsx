export default function AboutFamilyPhoto() {
  return (
    <section className="bg-cream px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto w-[90%] max-w-6xl overflow-hidden shadow-md md:w-[85%]">
        <img
          src="/images/about/team-hero.png"
          alt="The Boutique Fashion family — generations of craftsmanship and style"
          className="h-auto min-h-[260px] w-full object-cover object-[center_35%] md:min-h-[440px] lg:min-h-[520px]"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
