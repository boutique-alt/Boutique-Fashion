const SUPABASE_URL = 'https://qfxcqsmayfwisnsruoab.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeGNxc21heWZ3aXNuc3J1b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODA4ODcsImV4cCI6MjA5Nzg1Njg4N30.wuUPq_nlX8mwdZ3cI2FAqYkL7TTqNmhkAqHCnN8qZ9U'
const WEBHOOK_SECRET = 'bootiq-email-test-2026'
const TEST_EMAIL = 'hasibulpailan8@gmail.com'

const orderId = crypto.randomUUID()
const createdAt = new Date().toISOString()

const orderRecord = {
  id: orderId,
  user_id: null,
  user_email: TEST_EMAIL,
  status: 'pending',
  items: [
    {
      key: 'premium-jamdani-print-blue-co-ord-set-M',
      slug: 'premium-jamdani-print-blue-co-ord-set',
      name: 'Premium Jamdani print blue co-ord set',
      image: 'https://res.cloudinary.com/rjig41qb/image/upload/v1783153439/boutique/products/whb3rzoewpxaox6vvncs.jpg',
      price: 1999,
      size: 'M',
      quantity: 1,
    },
  ],
  billing: {
    firstName: 'Hasibul',
    lastName: 'Test',
    email: TEST_EMAIL,
    phone: '9876543210',
    address: 'Test Address, Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
  },
  subtotal: 1999,
  shipping: 0,
  total: 1999,
  payment_method: 'cod',
  payment_status: 'pending',
  created_at: createdAt,
}

async function insertOrder() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(orderRecord),
  })

  const text = await res.text()
  return { step: 'insert_order', status: res.status, body: text }
}

async function invokeEmailFunction() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-status-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'x-webhook-secret': WEBHOOK_SECRET,
    },
    body: JSON.stringify({
      type: 'INSERT',
      table: 'orders',
      record: orderRecord,
      old_record: null,
    }),
  })

  const text = await res.text()
  return { step: 'invoke_email', status: res.status, body: text }
}

const insertResult = await insertOrder()
console.log(JSON.stringify(insertResult, null, 2))

const emailResult = await invokeEmailFunction()
console.log(JSON.stringify(emailResult, null, 2))
console.log(`ORDER_ID=${orderId}`)
