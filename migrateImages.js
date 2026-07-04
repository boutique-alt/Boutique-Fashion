import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
// Needs to be the Service Role Key to bypass RLS for updates if admin login is not present in the script
// But since the user will run it, they can put their VITE_SUPABASE_ANON_KEY and it will only work if they update RLS or use Service Key.
// Actually, to make it simple, we will use the Service Role Key.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const cloudName = 'rjig41qb'
const uploadPreset = 'boutique_images'

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials! Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your terminal.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadToCloudinary(imageUrl) {
  try {
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`)
    
    const imageBlob = await imageRes.blob()

    const formData = new FormData()
    formData.append('file', imageBlob)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'boutique/products')

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (!uploadRes.ok) throw new Error(`Failed to upload to Cloudinary: ${uploadRes.statusText}`)
    
    const data = await uploadRes.json()
    return data.secure_url
  } catch (err) {
    console.error("Error migrating image:", imageUrl, err)
    return null
  }
}

async function migrate() {
  console.log("Starting image migration to Cloudinary...")
  
  const { data: products, error } = await supabase.from('products').select('*')
  
  if (error) {
    console.error("Error fetching products:", error)
    return
  }

  console.log(`Found ${products.length} products.`)
  let successCount = 0

  for (const product of products) {
    if (product.image && product.image.includes('supabase.co')) {
      console.log(`Migrating image for product: ${product.name}...`)
      const newUrl = await uploadToCloudinary(product.image)
      
      if (newUrl) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ image: newUrl })
          .eq('id', product.id)
          
        if (updateError) {
          console.error(`Failed to update product ${product.name}:`, updateError)
        } else {
          console.log(`✅ Successfully updated ${product.name}`)
          successCount++
        }
      }
    } else {
      console.log(`⏭️  Skipping product ${product.name}`)
    }
  }

  console.log(`\nMigration complete! Successfully migrated ${successCount} products.`)
}

migrate()
