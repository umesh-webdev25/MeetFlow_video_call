import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.29.78',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.29.78:5001',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://192.168.29.78:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1600,
  },
})