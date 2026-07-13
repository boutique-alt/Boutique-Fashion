export default function handler(req, res) {
  const { slug, name, image } = req.query;

  if (!slug) {
    return res.redirect(301, '/');
  }

  const productName = name ? decodeURIComponent(name) : 'Boutique Fashion Product';
  const productImage = image ? decodeURIComponent(image) : 'https://boutiquefashion.shop/images/about/team-hero.png';
  const fullImage = productImage.startsWith('http') ? productImage : `https://boutiquefashion.shop${productImage.startsWith('/') ? productImage : `/${productImage}`}`;
  const productUrl = `https://boutiquefashion.shop/product/${slug}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} | Boutique Fashion</title>
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${productUrl}">
  <meta property="og:title" content="${productName}">
  <meta property="og:description" content="Discover this premium product at Boutique Fashion.">
  <meta property="og:image" content="${fullImage}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${productUrl}">
  <meta name="twitter:title" content="${productName}">
  <meta name="twitter:description" content="Discover this premium product at Boutique Fashion.">
  <meta name="twitter:image" content="${fullImage}">

  <!-- Redirect to the actual product page -->
  <meta http-equiv="refresh" content="0;url=${productUrl}">
  <script>
    window.location.replace("${productUrl}");
  </script>
</head>
<body>
  <p>Redirecting to product... <a href="${productUrl}">Click here</a> if not redirected.</p>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
