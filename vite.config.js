import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Aumentar límite de advertencia a 2MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar node_modules en chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Separar assets grandes del Portfolio
          if (id.includes('/assets/Portfolio/')) {
            // Agrupar por categoría para mejor caching
            if (id.includes('/AudioVisual/')) return 'portfolio-audiovisual';
            if (id.includes('/Fotografia/')) return 'portfolio-fotografia';
            if (id.includes('/Social Media/')) return 'portfolio-social';
            if (id.includes('/Menu digital/')) return 'portfolio-menu';
            if (id.includes('/Diseño de Identidad Visual/')) return 'portfolio-diseno';
          }
        },
        // Configuración para assets estáticos
        assetFileNames: (assetInfo) => {
          // Mantener estructura de carpetas para assets grandes
          if (assetInfo.name && /\.(mp4|webm|jpg|jpeg|png|gif|svg)$/i.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    assetsInlineLimit: 0, // Desactivar inline de assets - todos como archivos separados
  },
  // Configuración para el servidor de desarrollo
  server: {
    fs: {
      strict: false
    }
  }
})
