import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmail() {
  console.log('Placing test order...')

  const mockOrder = {
    id: crypto.randomUUID(),
    user_email: 'royranit458@gmail.com',
    status: 'pending',
    items: [
      { name: 'Test Product', size: 'M', quantity: 1, price: 999 }
    ],
    billing: {
      firstName: 'Ranit',
      lastName: 'Roy',
      email: 'royranit458@gmail.com',
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '700001'
    },
    subtotal: 999,
    shipping: 0,
    total: 999,
    payment_method: 'cod',
    payment_status: 'pending',
    created_at: new Date().toISOString()
  }

  // Insert into orders table directly (this should trigger the email via the edge function, or wait, we call it manually?)
  // Actually, the client manually calls the edge function via notifyStatusEmail!
  console.log('Invoking send-status-email edge function...')
  const { data, error } = await supabase.functions.invoke('send-status-email', {
    body: {
      table: 'orders',
      record: mockOrder,
      event: 'INSERT'
    }
  })

  if (error) {
    console.error('Edge Function Error:')
    try {
      const errText = await error.context.text()
      console.log('Error details:', errText)
    } catch(e) {
      console.log(error)
    }
  } else {
    console.log('Edge Function Response:')
    console.log(data)
  }
}

testEmail()
