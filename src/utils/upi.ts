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

export function buildUpiQrUrl(upiLink: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiLink)}`
}
