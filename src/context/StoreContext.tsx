import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface CartItem {
  key: string
  slug: string
  name: string
  image: string
  price: number
  size: string
  quantity: number
}

export type User = import('../types/user').UserSession

interface StoreContextValue {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (item: Omit<CartItem, 'key'>) => void
  updateCartQty: (key: string, quantity: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  wishlist: string[]
  wishlistCount: number
  toggleWishlist: (slug: string) => void
  isInWishlist: (slug: string) => boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
  register: (user: User) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

const CART_KEY = 'bf-cart'
const WISHLIST_KEY = 'bf-wishlist'
const USER_KEY = 'bf-user'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadJson(CART_KEY, []))
  const [wishlist, setWishlist] = useState<string[]>(() => loadJson(WISHLIST_KEY, []))
  const [user, setUser] = useState<User | null>(() => loadJson(USER_KEY, null))
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const addToCart = useCallback((item: Omit<CartItem, 'key'>) => {
    const key = `${item.slug}-${item.size}`
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      }
      return [...prev, { ...item, key }]
    })
    setCartOpen(true)
  }, [])

  const updateCartQty = useCallback((key: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((i) => i.key !== key))
      return
    }
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }, [])

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }, [])

  const isInWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist])

  const login = useCallback((u: User) => setUser(u), [])
  const logout = useCallback(() => setUser(null), [])
  const register = useCallback((u: User) => setUser(u), [])

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart])
  const wishlistCount = wishlist.length

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      wishlist,
      wishlistCount,
      toggleWishlist,
      isInWishlist,
      user,
      login,
      logout,
      register,
      searchOpen,
      setSearchOpen,
      cartOpen,
      setCartOpen,
    }),
    [
      cart, cartCount, cartTotal, addToCart, updateCartQty, removeFromCart, clearCart,
      wishlist, wishlistCount, toggleWishlist, isInWishlist,
      user, login, logout, register,
      searchOpen, cartOpen,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
