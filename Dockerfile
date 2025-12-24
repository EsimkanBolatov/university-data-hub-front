FROM node:22-alpine

WORKDIR /app

# 1. Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

# 2. Копирование кода
COPY . .

# 3. Сборка (создается папка dist)
# Убедитесь, что в Variables на Railway задан VITE_API_URL
RUN npm run build

# 4. Запуск через vite preview
# --host 0.0.0.0: Обязательно для Docker/Railway, чтобы открыть доступ извне
# --port $PORT: Используем порт, который выдал Railway
CMD sh -c "npm run preview -- --host 0.0.0.0 --port ${PORT:-5173}"