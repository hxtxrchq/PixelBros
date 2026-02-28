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
            // framer-motion is large — separate chunk for caching
            if (id.includes('framer-motion')) return 'vendor-motion';
            // react + react-dom MUST stay together
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
