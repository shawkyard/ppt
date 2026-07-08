import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build. Output goes to /dist for Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
