# базовый образ с Node.js
FROM node:18 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install

# минимальный образ с Node.js
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]

EXPOSE 3000

# Обычный node:18 образ: 1.16GB; node:18-alpine после оптимизации: 100MB; C-программа на alpine: 5MB; Итоговый выигрыш в размере: ~90% меньше