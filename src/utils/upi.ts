export function buildUpiPaymentLink(upiId: string, payeeName: string, amount: number): string {
  const params = [
    `pa=${upiId.trim()}`,
    `pn=${encodeURIComponent(payeeName.trim())}`,
    `am=${amount.toFixed(2)}`,
    'cu=INR',
    `tn=${encodeURIComponent('Boutique Fashion Order')}`,
  ].join('&')
  return `upi://pay?${params}`
}

import QRCode from 'qrcode'

export async function buildUpiQrUrl(upiLink: string, size = 220): Promise<string> {
  try {
    return await QRCode.toDataURL(upiLink, { width: size, margin: 1 })
  } catch {
    return ''
  }
}
