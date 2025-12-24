import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: true, // Разрешает любые хосты (для Vite 6)
    host: true,         // Слушать 0.0.0.0
  },
  server: {
    allowedHosts: true, // На случай, если используется dev сервер
  }
})