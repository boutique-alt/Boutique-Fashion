import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useInView } from '../../hooks/useInView'

const col1Images = [
  '/images/dresses/olive-green-mul-chanderi-boolean-work-three-piece-set-main.webp',
  '/images/dresses/maroon-heritage-handblock-cotton-midi-dress-main.webp',
  '/images/dresses/white-khadi-embroidery-dress-main.webp',
  '/images/dresses/pure-modal-kaftaan-purple-dress-main.webp',
]

const col2Images = [
  '/images/dresses/cotton-handblock-braided-sleeve-kurti-set-main.webp',
  '/images/dresses/blue-halter-neck-cotton-dress-main.webp',
  '/images/dresses/white-begumpuri-long-a-line-dress-main.webp',
  '/images/dresses/teal-green-handpainted-inner-shrug-chanderi-silk-main.webp',
]

const col3Images = [
  '/images/dresses/forest-inspired-tiger-handblock-print-shirt-main.webp',
  '/images/dresses/classic-maroon-square-motif-cotton-shirt-main.webp',
  '/images/dresses/brown-bagru-handblock-shirt-main.webp',
  '/images/dresses/elephant-motif-white-handblock-shirt-main.webp',
]

export default function CeremonialEdit() {
  const { ref, inView } = useInView<HTMLElement>('200px')

  return (
    <section
      ref={ref}
      className={`w-full bg-[#FAF1F1] py-12 md:py-20 overflow-hidden relative${inView ? '' : ' marquee-pause-offscreen'}`}
    >
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 25s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }
        .animate-scroll-up-fast {
          animation: scroll-up 20s linear infinite;
        }
        .marquee-col:hover .animate-scroll-up,
        .marquee-col:hover .animate-scroll-down,
        .marquee-col:hover .animate-scroll-up-fast {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 h-[450px] md:h-[550px] overflow-hidden relative grid grid-cols-3 gap-3 md:gap-4 mask-gradient rounded-lg shadow-sm">
            <div className="marquee-col relative flex flex-col gap-3 md:gap-4 overflow-hidden">
              <div className="flex flex-col gap-3 md:gap-4 animate-scroll-up">
                {[...col1Images, ...col1Images].map((img, idx) => (
                  <div key={idx} className="w-full aspect-[3/4] overflow-hidden rounded bg-cream-dark/20 border border-accent/20">
                    <img
                      src={img}
                      alt="Ceremonial detail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="marquee-col relative flex flex-col gap-3 md:gap-4 overflow-hidden">
              <div className="flex flex-col gap-3 md:gap-4 animate-scroll-down">
                {[...col2Images, ...col2Images].map((img, idx) => (
                  <div key={idx} className="w-full aspect-[3/4] overflow-hidden rounded bg-cream-dark/20 border border-accent/20">
                    <img
                      src={img}
                      alt="Ceremonial detail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="marquee-col relative flex flex-col gap-3 md:gap-4 overflow-hidden">
              <div className="flex flex-col gap-3 md:gap-4 animate-scroll-up-fast">
                {[...col3Images, ...col3Images].map((img, idx) => (
                  <div key={idx} className="w-full aspect-[3/4] overflow-hidden rounded bg-cream-dark/20 border border-accent/20">
                    <img
                      src={img}
                      alt="Ceremonial detail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left px-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-maroon font-light uppercase mb-4 leading-tight">
              Ceremonial Edit
            </h2>
            <p className="text-sm md:text-base text-charcoal/70 font-light tracking-wide max-w-md mb-8">
              Timeless craft for moments that matter
            </p>
            <Link
              to="/dress"
              className="group inline-flex items-center justify-center gap-3 border border-maroon text-maroon hover:bg-maroon hover:text-cream px-10 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm"
            >
              Explore
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
