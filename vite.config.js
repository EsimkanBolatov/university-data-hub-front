import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0', // <-- Самое важное: слушать 0.0.0.0, а не localhost
    port: 8080,      // (Опционально) жестко задать порт, или оставить как есть
    allowedHosts: true, // <-- Разрешить Railway обращаться к приложению (для Vite 6)
  },
  server: {
    host: '0.0.0.0', // На случай, если вы используете dev-режим
    allowedHosts: true,
  }
})