import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { productPath } from '../../utils/productSlug'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, cartCount, cartTotal, updateCartQty, removeFromCart } = useStore()

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  if (!cartOpen) return null

  const close = () => setCartOpen(false)

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={close} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-accent px-5 py-4">
          <h2 className="font-serif text-lg text-charcoal">
            Shopping Cart
            {cartCount > 0 && (
              <span className="ml-2 text-sm font-sans text-charcoal/50">({cartCount})</span>
            )}
          </h2>
          <button onClick={close} className="text-charcoal/60 transition-colors hover:text-maroon" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag size={40} className="text-charcoal/20" />
              <p className="mt-4 text-sm text-charcoal/60">Your cart is empty</p>
              <Link
                to="/dress"
                onClick={close}
                className="mt-6 bg-maroon px-6 py-2.5 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => (
                <li key={item.key} className="flex gap-4 border-b border-accent pb-5">
                  <Link to={productPath(item.slug)} onClick={close} className="shrink-0">
                    <img src={item.image} alt={item.name} className="h-24 w-20 object-cover"  loading="lazy" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={productPath(item.slug)}
                      onClick={close}
                      className="line-clamp-2 text-sm text-charcoal transition-colors hover:text-maroon"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-charcoal/50">Size: {item.size}</p>
                    <p className="mt-1 text-sm font-medium text-charcoal">
                      ₹{item.price.toLocaleString('en-IN')}.00
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-accent">
                        <button
                          onClick={() => updateCartQty(item.key, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-charcoal/60 hover:text-maroon"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[2rem] border-x border-accent px-2 py-1.5 text-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.key, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-charcoal/60 hover:text-maroon"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-xs text-charcoal/40 transition-colors hover:text-gold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-accent px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-charcoal/70">Subtotal</span>
              <span className="font-serif text-lg text-charcoal">
                ₹{cartTotal.toLocaleString('en-IN')}.00
              </span>
            </div>
            <p className="mb-4 text-center text-[10px] tracking-wide text-charcoal/50 uppercase">
              Free shipping on all over India
            </p>
            <Link
              to="/cart"
              onClick={close}
              className="mb-2 block w-full border border-charcoal py-3 text-center text-xs font-medium tracking-[0.2em] text-charcoal uppercase transition-colors hover:bg-charcoal hover:text-cream"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={close}
              className="block w-full bg-maroon py-3 text-center text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
