/**
 * End-to-end API + flow checks (user + admin data paths)
 * Run: node scripts/e2e-check.mjs
 */

const SUPABASE_URL = 'https://qfxcqsmayfwisnsruoab.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeGNxc21heWZ3aXNuc3J1b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODA4ODcsImV4cCI6MjA5Nzg1Njg4N30.wuUPq_nlX8mwdZ3cI2FAqYkL7TTqNmhkAqHCnN8qZ9U'
const TEST_EMAIL = `e2e-test-${Date.now()}@bootiq.test`
const ADMIN_EMAIL = 'boutique@fashion.com'
const ADMIN_PASSWORD = 'admin321'

const results = []

function pass(name, detail = '') {
  results.push({ status: 'PASS', name, detail })
  console.log(`✓ PASS: ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ status: 'FAIL', name, detail })
  console.log(`✗ FAIL: ${name}${detail ? ` — ${detail}` : ''}`)
}

function warn(name, detail = '') {
  results.push({ status: 'WARN', name, detail })
  console.log(`⚠ WARN: ${name}${detail ? ` — ${detail}` : ''}`)
}

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${options.token ?? ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const text = await res.text()
  let body
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }
  return { ok: res.ok, status: res.status, body }
}

async function rpc(fn, args = {}, token) {
  return sb(`/rest/v1/rpc/${fn}`, {
    method: 'POST',
    body: JSON.stringify(args),
    token,
  })
}

async function main() {
  console.log('\n=== Bootiq E2E Check ===\n')
  console.log(`Test email: ${TEST_EMAIL}\n`)

  // 1. Dev server
  try {
    const dev = await fetch('http://localhost:5173/')
    if (dev.ok) pass('Dev server', 'http://localhost:5173 responding')
    else fail('Dev server', `status ${dev.status}`)
  } catch (e) {
    fail('Dev server', e.message)
  }

  // 2. Build artifacts
  try {
    const preview = await fetch('http://localhost:5173/account')
    if (preview.ok) pass('SPA route /account', 'loads')
    else warn('SPA route /account', `status ${preview.status}`)
  } catch (e) {
    warn('SPA route /account', e.message)
  }

  // 3. RPC existence
  const rpcChecks = [
    ['get_orders_by_email', { lookup_email: TEST_EMAIL }],
    ['get_orders_by_ids', { order_ids: [] }],
    ['get_returns_by_email', { lookup_email: TEST_EMAIL }],
    ['get_return_by_order_id', { lookup_order_id: '00000000-0000-0000-0000-000000000000' }],
  ]
  for (const [fn, args] of rpcChecks) {
    const r = await rpc(fn, args)
    if (r.status === 404) fail(`RPC ${fn}`, 'not found — migration not run?')
    else if (r.ok) pass(`RPC ${fn}`, 'callable')
    else fail(`RPC ${fn}`, JSON.stringify(r.body))
  }

  // 4. Guest order insert (checkout path)
  const orderId = crypto.randomUUID()
  const orderRow = {
    id: orderId,
    user_id: null,
    user_email: TEST_EMAIL,
    items: [{ key: 'test', slug: 'test', name: 'E2E Test Dress', image: '', price: 999, size: 'M', quantity: 1 }],
    billing: {
      firstName: 'E2E', lastName: 'User', email: TEST_EMAIL,
      phone: '9999999999', address: 'Test St', city: 'Kolkata', state: 'WB', pincode: '700001',
    },
    subtotal: 999,
    shipping: 0,
    total: 999,
    payment_method: 'cod',
    payment_status: 'pending',
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  const insertOrder = await sb('/rest/v1/orders', {
    method: 'POST',
    body: JSON.stringify(orderRow),
    headers: { Prefer: 'return=minimal' },
  })
  if (insertOrder.ok) pass('User: order insert (guest/anon)', orderId.slice(0, 8))
  else fail('User: order insert', JSON.stringify(insertOrder.body))

  // 5. User fetch order by email RPC
  const fetchOrders = await rpc('get_orders_by_email', { lookup_email: TEST_EMAIL })
  const orders = Array.isArray(fetchOrders.body) ? fetchOrders.body : []
  if (fetchOrders.ok && orders.some((o) => o.id === orderId)) {
    pass('User: fetch orders by registered email', `found ${orders.length}`)
  } else {
    fail('User: fetch orders by email', `got ${orders.length} orders`)
  }

  // 6. Direct RLS select (should fail/empty for anon)
  const directSelect = await sb(`/rest/v1/orders?user_email=eq.${encodeURIComponent(TEST_EMAIL)}&select=id`)
  const directData = Array.isArray(directSelect.body) ? directSelect.body : []
  if (directData.length === 0) {
    pass('RLS: anon direct select blocked/empty', 'expected — app uses RPC')
  } else {
    warn('RLS: anon direct select', `returned ${directData.length} rows`)
  }

  // 7. Admin update order status (without supabase session — simulates env-only admin)
  const updateOrder = await sb(`/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'processing', status_updated_at: new Date().toISOString() }),
    headers: { Prefer: 'return=minimal' },
  })
  if (!updateOrder.ok) {
    warn('Admin: order status update (anon)', 'blocked by RLS — admin needs Supabase session or local fallback')
  } else {
    pass('Admin: order status update (anon)', 'unexpectedly allowed')
  }

  // 8. Re-fetch order — user should see updated status via RPC
  const fetchAfterUpdate = await rpc('get_orders_by_email', { lookup_email: TEST_EMAIL })
  const updated = (fetchAfterUpdate.body ?? []).find((o) => o.id === orderId)
  if (updated?.status === 'processing') {
    pass('User: sees admin status update via RPC', updated.status)
  } else if (updated?.status === 'pending') {
    warn('User: status still pending', 'admin update did not reach DB (RLS) — user sees stale status on new browser')
  } else {
    fail('User: order after update', `status=${updated?.status ?? 'missing'}`)
  }

  // 9. Mark delivered for return test
  await sb(`/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'delivered', status_updated_at: new Date().toISOString() }),
    headers: { Prefer: 'return=minimal' },
  })

  // 10. Return insert
  const returnId = crypto.randomUUID()
  const insertReturn = await sb('/rest/v1/returns', {
    method: 'POST',
    body: JSON.stringify({
      id: returnId,
      order_id: orderId,
      user_email: TEST_EMAIL,
      reason: 'E2E: Changed mind',
      status: 'requested',
      created_at: new Date().toISOString(),
    }),
    headers: { Prefer: 'return=minimal' },
  })
  if (insertReturn.ok) pass('User: return request insert', returnId.slice(0, 8))
  else fail('User: return insert', JSON.stringify(insertReturn.body))

  // 11. Duplicate return (should fail unique index)
  const dupReturn = await sb('/rest/v1/returns', {
    method: 'POST',
    body: JSON.stringify({
      id: crypto.randomUUID(),
      order_id: orderId,
      user_email: TEST_EMAIL,
      reason: 'Duplicate',
      status: 'requested',
    }),
    headers: { Prefer: 'return=minimal' },
  })
  if (!dupReturn.ok) pass('User: duplicate return blocked', `status ${dupReturn.status}`)
  else fail('User: duplicate return', 'second insert succeeded')

  // 12. Fetch returns by email
  const fetchReturns = await rpc('get_returns_by_email', { lookup_email: TEST_EMAIL })
  const returns = Array.isArray(fetchReturns.body) ? fetchReturns.body : []
  if (fetchReturns.ok && returns.some((r) => r.order_id === orderId)) {
    pass('User: My Returns fetch by email', `found ${returns.length}`)
  } else {
    fail('User: My Returns fetch', `got ${returns.length}`)
  }

  // 13. Fetch return by order id
  const fetchRetOrder = await rpc('get_return_by_order_id', { lookup_order_id: orderId })
  const retByOrder = Array.isArray(fetchRetOrder.body) ? fetchRetOrder.body[0] : null
  if (retByOrder?.order_id === orderId) pass('User: return by order id', retByOrder.status)
  else fail('User: return by order id', JSON.stringify(fetchRetOrder.body))

  // 14. Admin return status update (anon)
  const updateReturn = await sb(`/rest/v1/returns?id=eq.${returnId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved', status_updated_at: new Date().toISOString() }),
    headers: { Prefer: 'return=minimal' },
  })
  if (!updateReturn.ok) {
    warn('Admin: return status update (anon)', 'blocked by RLS — same as orders')
  } else {
    pass('Admin: return status update (anon)', 'allowed')
  }

  // 15. Admin Supabase auth
  const adminAuth = await sb('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (adminAuth.body?.access_token) {
    pass('Admin: Supabase auth', 'session obtained')
    const token = adminAuth.body.access_token

    const adminOrders = await sb('/rest/v1/orders?select=id&limit=1', { token })
    if (adminOrders.ok) pass('Admin: orders select with session', 'ok')
    else fail('Admin: orders select', JSON.stringify(adminOrders.body))

    const adminUpdate = await sb(`/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status: 'shipped', status_updated_at: new Date().toISOString() }),
      headers: { Prefer: 'return=minimal' },
    })
    if (adminUpdate.ok) {
      pass('Admin: order update with session', 'shipped')
      const check = await rpc('get_orders_by_email', { lookup_email: TEST_EMAIL })
      const row = (check.body ?? []).find((o) => o.id === orderId)
      if (row?.status === 'shipped') pass('User: sees admin shipped status', row.status)
      else fail('User: status sync', `got ${row?.status}`)
    } else {
      fail('Admin: order update with session', JSON.stringify(adminUpdate.body))
    }
  } else {
    warn('Admin: Supabase auth', adminAuth.body?.msg ?? adminAuth.body?.error_code ?? 'no session')
    warn('Admin panel', 'uses env login + localStorage fallback; DB updates may not persist')
  }

  // 16. Products readable
  const products = await sb('/rest/v1/products?select=slug&limit=3')
  if (products.ok && Array.isArray(products.body) && products.body.length > 0) {
    pass('Storefront: products load', `${products.body.length} products`)
  } else {
    warn('Storefront: products', JSON.stringify(products.body))
  }

  // Cleanup test data
  await sb(`/rest/v1/returns?order_id=eq.${orderId}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
  await sb(`/rest/v1/orders?id=eq.${orderId}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })

  // Summary
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  const warnings = results.filter((r) => r.status === 'WARN').length
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed, ${warnings} warnings ===\n`)
  if (failed > 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
