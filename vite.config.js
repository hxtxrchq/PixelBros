import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split heavy libs into separate cached chunks
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('react-dom'))     return 'vendor-react';
            return 'vendor';
          }
        },
      }
    },
  },
  server: {
    fs: { strict: false }
  }
})
