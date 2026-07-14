import ReactGA from 'react-ga4'

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const IS_DEV = import.meta.env.DEV

let isInitialized = false

export const initGA = () => {
  if (isInitialized) return
  
  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID)
    isInitialized = true
    if (IS_DEV) {
      console.log(`[Analytics] GA4 Initialized with ID: ${MEASUREMENT_ID}`)
    }
  } else {
    if (IS_DEV) {
      console.warn('[Analytics] GA4 Measurement ID is missing. Analytics will not track.')
    }
  }
}

export const trackPageView = (path: string) => {
  if (!isInitialized) return
  ReactGA.send({ hitType: 'pageview', page: path })
  if (IS_DEV) {
    console.log(`[Analytics] PageView: ${path}`)
  }
}

interface AnalyticsItem {
  id?: string | number
  name: string
  price: number
  category?: string
  fabric?: string
}

// 1. Track Product Clicks (select_item in GA4 E-commerce)
export const trackProductClick = (item: AnalyticsItem) => {
  if (!isInitialized) return
  
  ReactGA.event('select_item', {
    item_list_id: 'product_list',
    item_list_name: 'Product List',
    items: [
      {
        item_id: String(item.id || ''),
        item_name: item.name,
        price: item.price,
        item_category: item.category || item.fabric || 'General',
      }
    ]
  })

  if (IS_DEV) {
    console.log('[Analytics] Event (select_item):', item.name)
  }
}

// 2. Track Product Details view (view_item in GA4 E-commerce)
export const trackProductView = (item: AnalyticsItem) => {
  if (!isInitialized) return

  ReactGA.event('view_item', {
    currency: 'INR',
    value: item.price,
    items: [
      {
        item_id: String(item.id || ''),
        item_name: item.name,
        price: item.price,
        item_category: item.category || item.fabric || 'General',
      }
    ]
  })

  if (IS_DEV) {
    console.log('[Analytics] Event (view_item):', item.name)
  }
}

// 3. Track Add to Cart (add_to_cart in GA4 E-commerce)
export const trackAddToCart = (item: AnalyticsItem, quantity = 1) => {
  if (!isInitialized) return

  ReactGA.event('add_to_cart', {
    currency: 'INR',
    value: item.price * quantity,
    items: [
      {
        item_id: String(item.id || ''),
        item_name: item.name,
        price: item.price,
        quantity: quantity,
        item_category: item.category || item.fabric || 'General',
      }
    ]
  })

  if (IS_DEV) {
    console.log('[Analytics] Event (add_to_cart):', item.name, 'Qty:', quantity)
  }
}

// 4. Track Purchase (purchase in GA4 E-commerce)
export const trackPurchase = (cartItems: any[], total: number, paymentMethod: string) => {
  if (!isInitialized) return

  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  ReactGA.event('purchase', {
    transaction_id: transactionId,
    value: total,
    currency: 'INR',
    shipping: 0,
    tax: 0,
    payment_type: paymentMethod,
    items: cartItems.map((item) => ({
      item_id: String(item.id || item.slug || ''),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category || 'General',
    }))
  })

  if (IS_DEV) {
    console.log('[Analytics] Event (purchase):', transactionId, 'Total:', total, 'Method:', paymentMethod)
  }
}
