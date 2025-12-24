FROM node:22-alpine

WORKDIR /app

# 1. Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

# 2. Копирование кода
COPY . .

# 3. Сборка
# Убедитесь, что в Variables на Railway задан VITE_API_URL, если он нужен при сборке
RUN npm run build

# --- Изменение здесь ---
# Устанавливаем легкий статический сервер глобально
RUN npm install -g serve

# 4. Запуск через serve
# -s dist: раздавать папку dist как SPA (single page app)
# -l $PORT: слушать порт, который выдал Railway
CMD serve -s dist -l ${PORT:-5173}