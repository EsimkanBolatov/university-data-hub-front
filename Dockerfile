FROM node:18-alpine

WORKDIR /app

# Dependencies орнату
COPY package.json package-lock.json ./
RUN npm install

# Кодты көшіру
COPY . .

EXPOSE 5173

# Dev server іске қосу
CMD ["npm", "run", "dev", "--", "--host"]