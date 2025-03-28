import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000,
    proxy: {
      '/api': {
        target: 'https://letter-web-app.onrender.com',
        changeOrigin: true,
      },
    },
  },
    base: '/letter-web-app/', // Add this line
  build: {
    outDir: 'dist',
      assetsDir: 'assets' 
  }

}) 
