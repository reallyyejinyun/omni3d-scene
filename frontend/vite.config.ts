import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { baseUrl } from './src/config/baseUrl';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 9001,
    open: true,
    proxy: {
      "/uploads": {
        target: baseUrl
      }
    }
  },
})
