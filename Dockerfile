# ИЗМЕНЕНИЕ: Используем Node.js 22 (требование Vite)
FROM node:22-alpine

WORKDIR /app

# 1. Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

# 2. Копирование кода
COPY . .

# 3. Сборка приложения (создает папку dist)
# Vite теперь будет работать, так как версия Node.js подходящая
RUN npm run build

# 4. Установка статического сервера
RUN npm install -g serve

# 5. Запуск
# Слушает порт из переменной Railway ($PORT) или 5173 по умолчанию
CMD serve -s dist -l ${PORT:-5173}