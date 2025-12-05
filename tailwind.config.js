/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основная палитра (по картинке)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Яркий синий для кнопок/акцентов
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Глубокий синий (Header/Sidebar)
          900: '#0f172a', // Текст заголовков
        },
        slate: {
          50: '#f8fafc', // Фон страницы
          100: '#f1f5f9', // Фон карточек/секций
          200: '#e2e8f0', // Границы
          500: '#64748b', // Вторичный текст
          800: '#1e293b', // Основной текст
        },
        success: '#10b981', // Зеленый для статов
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Нужен чистый шрифт
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}