FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
# jalankan migrasi dulu baru start server
CMD ["sh", "-c", "node scripts/migrate.js && node src/server.js"]
