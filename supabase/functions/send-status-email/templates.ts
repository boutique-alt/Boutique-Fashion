const BRAND = 'Boutique Fashion'
const BRAND_EMAIL = 'theboutiquesarees@gmail.com'
const ACCENT = '#2f4799'
const LOGO_URL =
  'https://boutiquefashion.shop/wp-content/uploads/2026/02/Boutique-Fashion_-New-Logo_V4.png'

export interface EmailContent {
  subject: string
  html: string
}

interface OrderItem {
  name?: string
  size?: string
  quantity?: number
  price?: number
  image?: string
  slug?: string
}

interface OrderBilling {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function orderIdShort(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

function paymentLabel(method: string): string {
  const labels: Record<string, string> = {
    razorpay: 'Card / UPI (Razorpay)',
    cod: 'Cash on Delivery',
    upi: 'UPI Transfer',
  }
  return labels[method] ?? method
}

function resolveImageUrl(image: string | undefined, siteUrl: string): string | null {
  if (!image || image.startsWith('data:')) return null
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/')) return `${siteUrl}${image}`
  return null
}

function buildItemImageCell(imageUrl: string | null, name: string): string {
  if (imageUrl) {
    return `<img src="${imageUrl}" alt="${name}" width="60" height="75" style="display:block;width:60px;height:75px;object-fit:cover;border:1px solid #dddddd;background:#f5f5f5" />`
  }

  return `<div style="width:60px;height:75px;border:1px solid #dddddd;background:#f5f5f5;text-align:center;line-height:75px;font-size:10px;color:#aaaaaa">—</div>`
}

function buildProductItemsList(items: OrderItem[], siteUrl: string): string {
  if (!items.length) return ''

  const rows = items.map((item) => {
    const name = escapeHtml(String(item.name ?? 'Item'))
    const size = escapeHtml(String(item.size ?? '—'))
    const qty = Number(item.quantity ?? 1)
    const price = Number(item.price ?? 0)
    const lineTotal = price * qty
    const imageUrl = resolveImageUrl(item.image, siteUrl)

    return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;border-bottom:1px solid #eeeeee">
      <tr>
        <td width="72" valign="top" style="padding:0 0 12px">${buildItemImageCell(imageUrl, name)}</td>
        <td valign="top" style="padding:0 0 12px 12px">
          <p style="margin:0;font-size:14px;line-height:1.4;color:#121216"><strong>${name}</strong></p>
          <p style="margin:6px 0 0;font-size:12px;color:#888">Size: ${size}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555">Qty: ${qty} · ${formatRupee(lineTotal)}</p>
        </td>
      </tr>
    </table>`
  }).join('')

  return `<div style="margin:8px 0 0">
    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888">Your items</p>
    ${rows}
  </div>`
}

function layout(title: string, body: string, cta?: { label: string; href: string }): string {
  const button = cta
    ? `<p style="margin:28px 0 0;text-align:center">
        <a href="${cta.href}" style="display:inline-block;background:${ACCENT};color:#fff;text-decoration:none;padding:12px 28px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">
          ${cta.label}
        </a>
      </p>`
    : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,'Times New Roman',serif;color:#121216">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #dddddd">
        <tr><td style="padding:24px 32px 20px;border-bottom:1px solid #dddddd;text-align:center">
          <img src="${LOGO_URL}" alt="${BRAND}" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto" />
        </td></tr>
        <tr><td style="padding:28px 32px 32px;font-size:15px;line-height:1.7">
          ${body}
          ${button}
          <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #eeeeee;font-size:12px;color:#888;text-align:center">
            Questions? Reply to this email or contact us at
            <a href="mailto:${BRAND_EMAIL}" style="color:${ACCENT};text-decoration:none">${BRAND_EMAIL}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildStatusBanner(title: string, subtitle?: string): string {
  const subtitleHtml = subtitle
    ? `<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#555">${subtitle}</p>`
    : ''

  return `<div style="margin:0 0 8px;padding:18px 20px;background:#f7f8fc;border:1px solid #e3e7f2;text-align:center">
    <p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT}"><strong>${escapeHtml(title)}</strong></p>
    ${subtitleHtml}
  </div>`
}

function buildOrderDetailsBlock(
  record: Record<string, unknown>,
  siteUrl: string,
  options?: { includeItems?: boolean },
): string {
  const includeItems = options?.includeItems ?? true
  const order = (record.order as Record<string, unknown> | undefined) ?? record
  const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : []
  const billing = (order.billing as OrderBilling | undefined) ?? {}
  const shortId = orderIdShort(String(order.id ?? record.order_id ?? ''))
  const subtotal = Number(order.subtotal ?? order.total ?? 0)
  const shipping = Number(order.shipping ?? 0)
  const total = Number(order.total ?? subtotal + shipping)
  const paymentMethod = paymentLabel(String(order.payment_method ?? ''))

  const customerName = [billing.firstName, billing.lastName].filter(Boolean).join(' ')
  const addressLines = [
    billing.address,
    [billing.city, billing.state, billing.pincode].filter(Boolean).join(', '),
  ].filter(Boolean)

  const addressHtml = addressLines.length
    ? `<p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.6">
        ${addressLines.map((line) => escapeHtml(line!)).join('<br>')}
       </p>`
    : ''

  return `<div style="margin:20px 0 0;padding:20px;background:#fafafa;border:1px solid #eeeeee">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#888">Order details</p>
    <p style="margin:0 0 16px;font-size:16px;color:${ACCENT}"><strong>#${shortId}</strong></p>
    ${customerName ? `<p style="margin:0;font-size:14px"><strong>${escapeHtml(customerName)}</strong></p>` : ''}
    ${billing.phone ? `<p style="margin:4px 0 0;font-size:13px;color:#555">${escapeHtml(billing.phone)}</p>` : ''}
    ${addressHtml}
    ${includeItems ? buildProductItemsList(items, siteUrl) : ''}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#555">Subtotal</td>
        <td style="padding:4px 0;font-size:14px;text-align:right">${formatRupee(subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#555">Shipping</td>
        <td style="padding:4px 0;font-size:14px;text-align:right">${shipping === 0 ? 'Free' : formatRupee(shipping)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0 4px;font-size:15px"><strong>Total</strong></td>
        <td style="padding:8px 0 4px;font-size:15px;text-align:right"><strong>${formatRupee(total)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" style="padding:8px 0 0;font-size:12px;color:#888">Payment: ${escapeHtml(paymentMethod)}</td>
      </tr>
    </table>
  </div>`
}

function buildOrderItemsSection(record: Record<string, unknown>, siteUrl: string): string {
  const order = (record.order as Record<string, unknown> | undefined) ?? record
  const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : []
  return buildProductItemsList(items, siteUrl)
}

export function buildOrderEmail(
  status: string,
  record: Record<string, unknown>,
  siteUrl: string,
  event: 'INSERT' | 'UPDATE',
): EmailContent | null {
  const orderId = String(record.id ?? '')
  const shortId = orderIdShort(orderId)
  const accountUrl = `${siteUrl}/account/orders`
  const items = buildOrderItemsSection(record, siteUrl)
  const details = buildOrderDetailsBlock(record, siteUrl, { includeItems: false })

  if (event === 'INSERT') {
    return {
      subject: `Order confirmed — ${shortId}`,
      html: layout(
        'Order confirmed',
        `${buildStatusBanner('Order confirmed', 'Thank you for your order. We have received it and will notify you when it ships.')}
         ${items}
         ${details}`,
        { label: 'View order', href: accountUrl },
      ),
    }
  }

  const messages: Record<string, { title: string; subtitle: string }> = {
    processing: {
      title: 'Order processing',
      subtitle: `Your order #${shortId} is being prepared.`,
    },
    shipped: {
      title: 'Order shipped',
      subtitle: `Your order #${shortId} is on its way.`,
    },
    delivered: {
      title: 'Order delivered',
      subtitle: `Your order #${shortId} has been delivered. Easy 7-day returns are available from your account.`,
    },
    cancelled: {
      title: 'Order cancelled',
      subtitle: `Your order #${shortId} has been cancelled. Contact us if you have questions.`,
    },
  }

  const intro = messages[status]
  if (!intro) return null

  return {
    subject: `Order ${status} — ${shortId}`,
    html: layout(
      intro.title,
      `${buildStatusBanner(intro.title, intro.subtitle)}${items}${details}`,
      { label: 'View order', href: accountUrl },
    ),
  }
}

export function buildReturnEmail(
  status: string,
  record: Record<string, unknown>,
  siteUrl: string,
): EmailContent | null {
  const orderId = String(record.order_id ?? '')
  const shortId = orderIdShort(orderId)
  const reason = escapeHtml(String(record.reason ?? ''))
  const accountUrl = `${siteUrl}/account/returns`
  const items = record.order ? buildOrderItemsSection(record, siteUrl) : ''
  const orderDetails = record.order
    ? buildOrderDetailsBlock(record, siteUrl, { includeItems: false })
    : ''

  const messages: Record<string, { subject: string; title: string; subtitle: string; reason?: boolean }> = {
    requested: {
      subject: `Return request received — ${shortId}`,
      title: 'Return request received',
      subtitle: `We received your return request for order #${shortId}. We will review within 48 hours.`,
      reason: true,
    },
    approved: {
      subject: `Return approved — ${shortId}`,
      title: 'Return approved',
      subtitle: `Your return for order #${shortId} has been approved. Pickup will be arranged shortly.`,
    },
    picked_up: {
      subject: `Return picked up — ${shortId}`,
      title: 'Return picked up',
      subtitle: `Your return item for order #${shortId} has been picked up. Refund will be processed in 7–10 business days.`,
    },
    refunded: {
      subject: `Refund processed — ${shortId}`,
      title: 'Refund processed',
      subtitle: `Your refund for order #${shortId} has been processed. It may take 5–7 business days to reflect in your account.`,
    },
    rejected: {
      subject: `Return update — ${shortId}`,
      title: 'Return update',
      subtitle: `Your return request for order #${shortId} could not be approved. Please contact customer care for help.`,
    },
  }

  const msg = messages[status]
  if (!msg) return null

  const reasonHtml = msg.reason
    ? `<p style="margin:12px 0 0;font-size:13px;color:#555"><strong>Reason:</strong> ${reason}</p>`
    : ''

  return {
    subject: msg.subject,
    html: layout(
      msg.title,
      `${buildStatusBanner(msg.title, msg.subtitle)}${reasonHtml}${items}${orderDetails}`,
      { label: 'Track return', href: accountUrl },
    ),
  }
}

export function getRecipientEmail(record: Record<string, unknown>): string | null {
  const email = record.user_email
  if (typeof email !== 'string' || !email.includes('@')) return null
  return email.toLowerCase()
}
