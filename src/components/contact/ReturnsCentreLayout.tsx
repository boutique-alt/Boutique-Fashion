import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import ContactForm from './ContactForm'
import { brand } from '../../data/navigation'
import { contactSections, type ContactSectionId } from '../../data/contact'

export default function ReturnsCentreLayout() {
  const [active, setActive] = useState<ContactSectionId>('returns')
  const section = contactSections.find((s) => s.id === active) ?? contactSections[0]

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
      <aside className="border border-accent bg-cream-dark/30 p-4 md:p-6">
        <h3 className="mb-4 font-serif text-lg text-charcoal">Returns Centre</h3>
        <nav className="space-y-1">
          {contactSections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`block w-full border-l-2 px-3 py-2.5 text-left text-xs leading-relaxed transition-colors ${
                active === item.id
                  ? 'border-maroon bg-maroon/5 font-medium text-maroon'
                  : 'border-transparent text-charcoal/70 hover:border-charcoal/20 hover:text-charcoal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div>
        <h2 className="font-serif text-2xl font-medium text-charcoal md:text-3xl">
          {section.title}
        </h2>
        <div className="mt-6 space-y-4">
          {section.content.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-charcoal/70 md:text-[15px]">
              {paragraph}
            </p>
          ))}
        </div>

        {active === 'care' && (
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-serif text-xl text-charcoal">Send A Message</h3>
              <ContactForm />
            </div>
            <div>
              <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded border border-accent bg-cream-dark/30 p-8 text-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <a
                  href="mailto:suniljaiswal@gmail.com"
                  className="font-serif text-lg font-medium text-maroon transition-colors hover:text-maroon-light"
                >
                  suniljaiswal@gmail.com
                </a>
              </div>
              <h3 className="mb-6 font-serif text-xl text-charcoal">Contact Information</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <a href={`mailto:${brand.email}`} className="text-sm text-charcoal/70 transition-colors hover:text-maroon">
                    {brand.email}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="text-sm text-charcoal/70 transition-colors hover:text-maroon">
                    {brand.phone}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-maroon" strokeWidth={1.5} />
                  <span className="text-sm leading-relaxed text-charcoal/70">{brand.address}</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-charcoal/60">{brand.hours}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
