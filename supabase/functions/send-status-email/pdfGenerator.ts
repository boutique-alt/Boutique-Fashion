import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'

function formatCurrency(amount: number): string {
  return `INR ${amount.toLocaleString('en-IN')}.00`
}

async function embedImage(pdfDoc: any, url: string) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    // Try based on extension
    if (url.toLowerCase().endsWith('.png') || url.includes('png')) {
      return await pdfDoc.embedPng(buffer).catch(() => pdfDoc.embedJpg(buffer).catch(() => null));
    }
    return await pdfDoc.embedJpg(buffer).catch(() => pdfDoc.embedPng(buffer).catch(() => null));
  } catch {
    return null;
  }
}

export async function generateInvoicePdf(record: Record<string, any>, siteUrl: string): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = height - 50

  // Header Logo
  const logoUrl = `${siteUrl}/images/assets/logo.png`;
  const logoImage = await embedImage(pdfDoc, logoUrl);
  
  if (logoImage) {
    const logoDims = logoImage.scaleToFit(150, 40);
    page.drawImage(logoImage, {
      x: 50,
      y: y - logoDims.height + 15,
      width: logoDims.width,
      height: logoDims.height,
    });
  } else {
    page.drawText('Boutique Fashion', { x: 50, y, size: 24, font: boldFont, color: rgb(0.5, 0, 0) })
  }
  
  y -= 30
  page.drawText('INVOICE / BILL', { x: 50, y, size: 14, font: boldFont, color: rgb(0.3, 0.3, 0.3) })

  // Order Details
  const orderId = record.id ? String(record.id).slice(0, 8).toUpperCase() : 'N/A'
  const date = record.created_at ? new Date(record.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  const paymentMethod = record.payment_method ? String(record.payment_method).toUpperCase() : 'N/A'

  y -= 40
  page.drawText(`Order ID: #${orderId}`, { x: 50, y, size: 10, font: boldFont })
  page.drawText(`Date: ${date}`, { x: 50, y: y - 15, size: 10, font })
  page.drawText(`Payment Method: ${paymentMethod}`, { x: 50, y: y - 30, size: 10, font })

  // Billing Details
  const billing = record.billing || {}
  const name = `${billing.firstName || ''} ${billing.lastName || ''}`.trim()
  const email = billing.email || record.user_email || ''
  const phone = billing.phone || ''
  const address = billing.address || ''
  const city = billing.city || ''
  const state = billing.state || ''
  const pincode = billing.pincode || ''

  page.drawText('Bill To:', { x: 300, y, size: 12, font: boldFont })
  page.drawText(name || 'Customer', { x: 300, y: y - 15, size: 10, font })
  page.drawText(email, { x: 300, y: y - 30, size: 10, font })
  page.drawText(phone, { x: 300, y: y - 45, size: 10, font })
  page.drawText(`${address}, ${city}`, { x: 300, y: y - 60, size: 10, font })
  page.drawText(`${state} - ${pincode}`, { x: 300, y: y - 75, size: 10, font })

  y -= 110

  // Table Header
  page.drawRectangle({ x: 50, y: y - 15, width: 495, height: 25, color: rgb(0.95, 0.95, 0.95) })
  page.drawText('Image', { x: 60, y: y - 5, size: 10, font: boldFont })
  page.drawText('Item', { x: 120, y: y - 5, size: 10, font: boldFont })
  page.drawText('Size', { x: 300, y: y - 5, size: 10, font: boldFont })
  page.drawText('Qty', { x: 380, y: y - 5, size: 10, font: boldFont })
  page.drawText('Price', { x: 450, y: y - 5, size: 10, font: boldFont })

  y -= 45

  // Items
  const items = Array.isArray(record.items) ? record.items : []
  for (const item of items) {
    const itemName = String(item.name || 'Product').substring(0, 40)
    const size = String(item.size || '-')
    const qty = String(item.quantity || '1')
    const price = formatCurrency(Number(item.price || 0))
    
    // Product Image
    let imageUrl = item.image || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    const prodImage = await embedImage(pdfDoc, imageUrl);
    if (prodImage) {
      const imgDims = prodImage.scaleToFit(40, 40);
      page.drawImage(prodImage, {
        x: 60,
        y: y - 20, // adjust Y to center vertically in row
        width: imgDims.width,
        height: imgDims.height,
      });
    }

    // Text needs to be aligned with the row
    page.drawText(itemName, { x: 120, y, size: 10, font })
    page.drawText(size, { x: 300, y, size: 10, font })
    page.drawText(qty, { x: 380, y, size: 10, font })
    page.drawText(price, { x: 450, y, size: 10, font })
    
    y -= 55 // Increase row height to accommodate images
    if (y < 100) {
      y -= 25 
    }
  }

  y -= 10
  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  })

  y -= 25
  const subtotal = formatCurrency(Number(record.subtotal || 0))
  const total = formatCurrency(Number(record.total || 0))

  page.drawText('Subtotal:', { x: 350, y, size: 10, font })
  page.drawText(subtotal, { x: 450, y, size: 10, font })

  y -= 20
  page.drawText('Shipping:', { x: 350, y, size: 10, font })
  page.drawText('Free', { x: 450, y, size: 10, font })

  y -= 25
  page.drawText('Total Amount:', { x: 350, y, size: 12, font: boldFont, color: rgb(0.5, 0, 0) })
  page.drawText(total, { x: 450, y, size: 12, font: boldFont, color: rgb(0.5, 0, 0) })

  // Footer
  page.drawText('Thank you for shopping with Boutique Fashion!', { x: 50, y: 50, size: 10, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
  page.drawText('For any queries, please contact us at theboutiquesarees@gmail.com', { x: 50, y: 35, size: 9, font, color: rgb(0.6, 0.6, 0.6) })

  const pdfBytes = await pdfDoc.saveAsBase64()
  return pdfBytes
}
