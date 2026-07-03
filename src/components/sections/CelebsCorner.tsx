import { instagramPosts } from '../../data/products'

export default function CelebsCorner() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-8 text-center font-serif text-2xl font-medium tracking-wide text-charcoal md:mb-10 md:text-3xl">
          From Our Instagram
        </h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#f4f4f4]"
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain object-center p-1 transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
