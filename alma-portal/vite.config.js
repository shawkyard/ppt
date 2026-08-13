import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Portal is built as a static SPA — deploys to Cloudflare Pages, Netlify, or Vercel.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
})
