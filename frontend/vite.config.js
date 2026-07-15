import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://meetflow-video-call.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: 'https://meetflow-video-call.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1600,
  },
})
