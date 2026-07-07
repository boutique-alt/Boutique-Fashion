import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const requiredVercelEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const

export default defineConfig(({ mode }) => {
  if (process.env.VERCEL && mode === 'production') {
    const missing = requiredVercelEnv.filter((key) => !process.env[key]?.trim())
    if (missing.length > 0) {
      throw new Error(
        `Missing Vercel environment variables: ${missing.join(', ')}. ` +
          'Add them in Vercel → Settings → Environment Variables, then redeploy.',
      )
    }
  }

  return {
    plugins: [react(), tailwindcss(), ViteImageOptimizer({})],
    test: {
      environment: 'jsdom',
      globals: true,
    },
  }
})
