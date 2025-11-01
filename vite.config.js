import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow external connections from mobile devices on same network
    // When host is '0.0.0.0', Vite shows both localhost and network IP links
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
