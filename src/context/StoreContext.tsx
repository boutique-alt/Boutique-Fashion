/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isSupabaseConfigured } from '../config/env'
import { supabase } from '../lib/supabase'
import { customerSignOut, getCustomerSession } from '../services/authService'
import { fetchUserCart, saveUserCart } from '../services/cartService'
import { fetchUserWishlist, saveUserWishlist } from '../services/wishlistService'

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
  authReady: boolean
  login: (user: User) => void
  logout: () => void
  register: (user: User) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

async function loadUserData(userId: string): Promise<{ cart: CartItem[]; wishlist: string[] }> {
  const [cart, wishlist] = await Promise.all([
    fetchUserCart(userId),
    fetchUserWishlist(userId),
  ])
  return { cart, wishlist }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured())
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const skipNextCartSave = useRef(false)
  const skipNextWishlistSave = useRef(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthReady(true)
      return
    }

    const applySession = async (sessionUserId: string | null, session: User | null) => {
      setUserId(sessionUserId)
      setUser(session)

      if (sessionUserId) {
        skipNextCartSave.current = true
        skipNextWishlistSave.current = true
        const data = await loadUserData(sessionUserId)
        setCart(data.cart)
        setWishlist(data.wishlist)
      } else {
        setCart([])
        setWishlist([])
      }
      setAuthReady(true)
    }

    getCustomerSession().then(async (session) => {
      if (!supabase) return
      const { data: { session: authSession } } = await supabase.auth.getSession()
      await applySession(authSession?.user?.id ?? null, session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, authSession) => {
      if (authSession?.user) {
        const email = authSession.user.email ?? ''
        const name = (authSession.user.user_metadata?.name as string) || email.split('@')[0]
        await applySession(authSession.user.id, { name, email })
      } else {
        await applySession(null, null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return
    if (skipNextCartSave.current) {
      skipNextCartSave.current = false
      return
    }
    const timer = setTimeout(() => {
      void saveUserCart(userId, cart).catch(() => {})
    }, 400)
    return () => clearTimeout(timer)
  }, [cart, userId])

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return
    if (skipNextWishlistSave.current) {
      skipNextWishlistSave.current = false
      return
    }
    const timer = setTimeout(() => {
      void saveUserWishlist(userId, wishlist).catch(() => {})
    }, 400)
    return () => clearTimeout(timer)
  }, [wishlist, userId])

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
  const logout = useCallback(async () => {
    await customerSignOut()
    setUser(null)
    setUserId(null)
    setCart([])
    setWishlist([])
  }, [])
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
      authReady,
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
      user, authReady, login, logout, register,
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
