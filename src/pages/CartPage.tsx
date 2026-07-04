import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { productPath } from '../utils/productSlug'

export default function CartPage() {
  const { cart, cartTotal, updateCartQty, removeFromCart, clearCart } = useStore()

  return (
    <main>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag size={48} className="mx-auto text-charcoal/20" />
              <p className="mt-4 text-charcoal/60">Your cart is empty</p>
              <Link
                to="/dress"
                className="mt-6 inline-block bg-maroon px-8 py-3 text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden border-b border-accent pb-3 text-xs font-medium tracking-[0.15em] text-charcoal/50 uppercase md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span />
              </div>

              <ul className="divide-y divide-accent">
                {cart.map((item) => (
                  <li key={item.key} className="grid gap-4 py-6 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4">
                    <div className="flex gap-4">
                      <Link to={productPath(item.slug)}>
                        <img src={item.image} alt={item.name} className="h-28 w-20 object-cover" />
                      </Link>
                      <div>
                        <Link
                          to={productPath(item.slug)}
                          className="text-sm text-charcoal transition-colors hover:text-maroon"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-charcoal/50">Size: {item.size}</p>
                      </div>
                    </div>
                    <p className="text-sm text-charcoal md:text-center">
                      ₹{item.price.toLocaleString('en-IN')}.00
                    </p>
                    <div className="md:flex md:justify-center">
                      <div className="inline-flex items-center border border-accent">
                        <button
                          onClick={() => updateCartQty(item.key, item.quantity - 1)}
                          className="px-3 py-2 text-charcoal/60 hover:text-maroon"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[2.5rem] border-x border-accent px-3 py-2 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.key, item.quantity + 1)}
                          className="px-3 py-2 text-charcoal/60 hover:text-maroon"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-charcoal md:text-center">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                    </p>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-charcoal/40 transition-colors hover:text-gold"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col items-end gap-6 border-t border-accent pt-8">
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Subtotal</span>
                    <span className="font-medium text-charcoal">₹{cartTotal.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Shipping</span>
                    <span className="text-maroon">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-accent pt-3">
                    <span className="font-medium text-charcoal">Total</span>
                    <span className="font-serif text-xl text-charcoal">₹{cartTotal.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                  <button
                    onClick={clearCart}
                    className="flex-1 border border-accent py-3 text-xs font-medium tracking-[0.15em] text-charcoal/60 uppercase transition-colors hover:border-charcoal hover:text-charcoal"
                  >
                    Clear Cart
                  </button>
                  <Link
                    to="/checkout"
                    className="flex-1 bg-maroon py-3 text-center text-xs font-medium tracking-[0.2em] text-cream uppercase transition-colors hover:bg-maroon-light"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
