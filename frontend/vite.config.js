import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/revenue': 'http://localhost:8080',
      '/filters': 'http://localhost:8080',
      '/orders': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      // weitere API-Routen nach Bedarf ergänzen
    }
  }
})
