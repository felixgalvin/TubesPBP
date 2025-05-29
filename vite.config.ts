import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Hanya proxy untuk API endpoints yang benar-benar ada di backend
      '/api': 'http://localhost:3000',
    }
  }
})