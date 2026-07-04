export function buildUpiPaymentLink(upiId: string, payeeName: string, amount: number): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: 'Boutique Fashion Order',
  })
  return `upi://pay?${params.toString()}`
}

import QRCode from 'qrcode'

export async function buildUpiQrUrl(upiLink: string, size = 220): Promise<string> {
  try {
    return await QRCode.toDataURL(upiLink, { width: size, margin: 1 })
  } catch {
    return ''
  }
}
