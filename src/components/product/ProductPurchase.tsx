import { useState, useMemo } from 'react'
import { Truck, RotateCcw, ChevronDown, ChevronUp, Mail, Phone, Sparkles } from 'lucide-react'
import type { ProductDetail } from '../../data/productCatalog'
import type { ProductAddon } from '../../types/adminProduct'
import { useStore } from '../../context/StoreContext'
import WishlistButton from '../wishlist/WishlistButton'

interface ProductPurchaseProps {
  product: ProductDetail
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const [size, setSize] = useState(product.sizes[0] ?? 'M')
  const [expanded, setExpanded] = useState(false)
  
  // Accordion states
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [careOpen, setCareOpen] = useState(false)

  // Addons — each addon has checked state
  const [addonStates, setAddonStates] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    product.addons?.forEach((a) => { init[a.id] = false })
    return init
  })

  const { addToCart } = useStore()

  const addons = product.addons ?? []

  const totalPrice = useMemo(() => {
    let t = product.price
    addons.forEach((a) => {
      if (!a.optional || addonStates[a.id]) t += a.price
    })
    return t
  }, [product.price, addons, addonStates])

  const desc = product.description || product.shortDescription || ''
  const showReadMore = desc.length > 120

  const handleAddToCart = () => {
    const selectedAddons = addons
      .filter((a) => !a.optional || addonStates[a.id])
      .map((a) => a.label)
      .join(', ')

    addToCart({
      slug: product.slug,
      name: product.name + (selectedAddons ? ` (+ ${selectedAddons})` : ''),
      image: product.image,
      price: totalPrice,
      size,
      quantity: 1,
    })
  }



  return (
    <div className="flex flex-col gap-6 text-charcoal font-sans">

      {/* Box 1: Product Header (Title, SKU, Description) */}
      <div className="border border-accent/80 bg-[#FAF7F7] p-5 rounded-md shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-charcoal leading-snug">
              {product.name}
            </h1>
            <p className="mt-2 text-[10px] font-semibold tracking-widest text-charcoal/40 uppercase">
              Product Code: {product.sku ? product.sku : `SKU-${product.id.toString().slice(0, 8).toUpperCase()}`}
            </p>
          </div>
          <WishlistButton slug={product.slug} className="mt-1 shrink-0" />
        </div>

        {/* Product Description */}
        <div className="mt-4 pt-4 border-t border-accent/40 text-[13px] font-light leading-relaxed text-charcoal/80">
          <p>
            {showReadMore && !expanded
              ? desc.slice(0, 120) + '…'
              : desc}
          </p>
          {showReadMore && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 text-[11px] font-semibold text-maroon underline underline-offset-2 hover:no-underline"
            >
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>

      {/* Box 2: Price Block */}
      <div className="border border-accent/80 bg-white p-5 rounded-md shadow-sm">
        <p className="text-[11px] font-bold text-charcoal/50 uppercase tracking-widest">Regular price</p>
        <p className="font-serif text-2xl font-bold text-maroon mt-1.5">
          MRP ₹{totalPrice.toLocaleString('en-IN')} INR
        </p>
        <p className="text-[10px] font-light text-charcoal/50 mt-1">(Inclusive of all taxes)</p>
      </div>

      {/* Box 3: Size Selector */}
      <div className="bg-white rounded-md shadow-sm">
        <div className="flex items-center gap-3 mb-4 px-1">
          <p className="text-[15px] font-medium text-maroon">Size</p>
          <div className="w-[1px] h-4 bg-maroon/30"></div>
          <button className="text-[14px] font-medium text-maroon underline underline-offset-4 hover:no-underline">
            Size Chart
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5 px-1">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`min-w-[3rem] h-10 rounded-sm border px-3 py-1.5 text-[14px] font-medium tracking-wide transition-all uppercase shadow-sm ${
                size === s
                  ? 'border-maroon text-maroon bg-white ring-1 ring-maroon'
                  : 'border-accent/40 text-maroon hover:border-maroon hover:shadow bg-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Box 4: Add-ons */}
      {addons.length > 0 && (
        <div className="space-y-4">
          {addons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              checked={addon.optional ? addonStates[addon.id] : true}
              disabled={!addon.optional}
              onChange={(val) =>
                setAddonStates((prev) => ({ ...prev, [addon.id]: val }))
              }
            />
          ))}
        </div>
      )}

      {/* Box 5: Add to Cart & Delivery Info */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 bg-maroon py-3.5 text-[15px] tracking-wide text-white uppercase transition-colors hover:bg-maroon-light rounded-sm shadow-sm font-medium"
        >
          Add to Cart
        </button>
        
        <div className="flex justify-center items-center gap-2.5 text-sm font-semibold text-maroon pt-1">
          <Truck size={18} className="shrink-0" />
          <span>Estimated Delivery 7-9 working days after the order.</span>
        </div>
      </div>

      {/* Box 6: Accordions Group */}
      <div className="flex flex-col gap-4 bg-white rounded-md p-4 shadow-sm border border-accent/40 mt-2">
        
        {/* Product Details accordion */}
        <div className="border border-accent/40 rounded-sm">
          <button
            onClick={() => setDetailsOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-bold text-maroon hover:bg-[#FAF7F7] transition-colors"
          >
            Product Details
            {detailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {detailsOpen && (
            <div className="px-4 pb-4 pt-2">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[14px]">
                {['Material', 'Design Pattern', 'Occasion', 'Length', 'Neckline', 'Sleeve Length'].map((key) => {
                  const val = product.productDetails?.[key] || (key === 'Material' ? product.fabric : '')
                  if (!val) return null
                  return (
                    <div key={key} className="flex justify-between items-end border-b border-maroon/40 pb-2">
                      <span className="text-maroon font-medium">{key}</span>
                      <span className="text-charcoal/90 text-right">{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Delivery & Payment accordion */}
        <div className="border border-accent/40 rounded-sm mt-2">
          <button
            onClick={() => setDeliveryOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-bold text-maroon hover:bg-[#FAF7F7] transition-colors"
          >
            Delivery & Payment
            {deliveryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {deliveryOpen && (
            <div className="px-4 pb-4 pt-2 text-[14px] text-charcoal/80 leading-relaxed space-y-3 font-medium">
              <p>All of our products are made to order, crafted after we receive your request. Most items feature intricate handwork, such as painting, embroidery, or other embellishments.</p>
              <p>As a result, we typically dispatch products 7-9 working days after the order. Transit times vary from 2-5 days depending on the destination.</p>
              <p className="font-semibold text-maroon">Cash on Delivery (COD) available</p>
              <p className="font-semibold text-maroon">Before delivery & alteration need full payment.</p>
            </div>
          )}
        </div>

        {/* Return & Exchange accordion */}
        <div className="border border-accent/40 rounded-sm mt-2">
          <button
            onClick={() => setReturnOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-bold text-maroon hover:bg-[#FAF7F7] transition-colors"
          >
            Return & Exchange
            {returnOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {returnOpen && (
            <div className="px-4 pb-4 pt-2 text-[14px] text-charcoal/80 font-medium space-y-3">
              <div className="flex items-start gap-2.5">
                <RotateCcw size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>3 days no-questions-asked Returns/Exchange</p>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Free pickup for Returns/Exchanges</p>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Exchanges not limited to size adjustments, offered on any product</p>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>International/Customized orders not eligible for Returns/Exchanges</p>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Returns/Exchanges allowed only for unused products with tags</p>
              </div>
            </div>
          )}
        </div>

        {/* Care Instruction accordion */}
        <div className="border border-accent/40 rounded-sm mt-2">
          <button
            onClick={() => setCareOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-bold text-maroon hover:bg-[#FAF7F7] transition-colors"
          >
            Care Instruction
            {careOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {careOpen && (
            <div className="px-4 pb-4 pt-2 text-[14px] text-charcoal/80 font-medium space-y-3">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Hand wash in cold water with a mild detergent</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Dry Clean recommended for Sarees</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Wash inside out to prevent fading</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-maroon shrink-0 mt-0.5" />
                <p>Iron on low heat, avoiding embellishments, painting or embroidery</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Box 7: Payment & Customer Support */}
      <div className="border border-accent/80 bg-white p-5 rounded-md shadow-sm divide-y divide-accent/40">
        
        {/* We Accept */}
        <div className="pb-5">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-3 text-charcoal/80">We Accept</h3>
          <div className="flex flex-wrap gap-2 opacity-80">
            <span className="px-3 py-1 bg-[#FAF7F7] rounded text-[10px] font-semibold tracking-wider text-charcoal/60 border border-accent/40">VISA</span>
            <span className="px-3 py-1 bg-[#FAF7F7] rounded text-[10px] font-semibold tracking-wider text-charcoal/60 border border-accent/40">MASTERCARD</span>
            <span className="px-3 py-1 bg-[#FAF7F7] rounded text-[10px] font-semibold tracking-wider text-charcoal/60 border border-accent/40">AMEX</span>
            <span className="px-3 py-1 bg-[#FAF7F7] rounded text-[10px] font-semibold tracking-wider text-charcoal/60 border border-accent/40">UPI</span>
            <span className="px-3 py-1 bg-[#FAF7F7] rounded text-[10px] font-semibold tracking-wider text-charcoal/60 border border-accent/40">NETBANKING</span>
          </div>
        </div>

        {/* Customer Care */}
        <div className="pt-5">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-3 text-charcoal/80">Customer Care</h3>
          <div className="space-y-4 text-[13px] text-charcoal/70 font-light leading-relaxed">
            <p>
              <strong className="font-semibold text-charcoal">Have a question? We can help.</strong><br/>
              Mon-Sat 10:00 AM To 6:30 PM (IST)
            </p>
            <p>
              <strong className="font-semibold text-charcoal">For any assistance/query, Please contact at</strong><br/>
              Sujatra, Survey no 314/3 Marble Market, Bavdhan Pune 411021, Maharashtra
            </p>
            <p className="flex items-center gap-2 pt-1">
              <Phone size={13} className="text-maroon shrink-0" />
              <span>Contact number: <a href="tel:+919881880004" className="text-maroon font-medium hover:underline">+91 9881880004</a></span>
            </p>
            <p className="flex items-start gap-2">
              <Mail size={13} className="text-maroon shrink-0 mt-0.5" />
              <span>Email: <a href="mailto:care@sujatra.com" className="text-maroon font-medium hover:underline font-normal">care@sujatra.com</a> or DM us on Instagram/Facebook.</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

/* ── Addon Card sub-component ── */
interface AddonCardProps {
  addon: ProductAddon
  checked: boolean
  disabled: boolean
  onChange: (val: boolean) => void
}

function AddonCard({ addon, checked, disabled, onChange }: AddonCardProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col p-4 rounded-md border transition-all shadow-sm ${
        checked
          ? 'border-maroon bg-maroon/5'
          : 'border-accent/80 bg-white hover:border-maroon/40'
      } ${disabled ? 'cursor-default' : ''}`}
    >
      <div className="flex items-start gap-3">
        {addon.optional && (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 h-4 w-4 accent-maroon shrink-0"
          />
        )}
        <div className="flex-1">
          <p className="text-xs font-bold tracking-wider text-charcoal uppercase">{addon.label}</p>
          <p className="text-[13px] text-charcoal/60 mt-1 font-light leading-relaxed">{addon.description}</p>
          <div className="mt-3 pt-2.5 border-t border-accent/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-maroon uppercase tracking-wide">
                MRP ₹{addon.price.toLocaleString('en-IN')} INR
              </p>
              <p className="text-[9px] font-light text-charcoal/40">(Inclusive of all taxes)</p>
            </div>
            {addon.optional && (
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${checked ? 'text-maroon bg-maroon/10' : 'text-charcoal/40'}`}>
                {checked ? 'Added' : 'Add Optional'}
              </span>
            )}
          </div>
        </div>
      </div>
    </label>
  )
}
