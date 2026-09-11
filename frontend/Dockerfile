FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite nge-bake VITE_API_URL ke bundle saat build, bukan dibaca pas container
# jalan. Jadi harus masuk lewat build arg, kalau tidak fallback ke path relatif
# /api/v1 (yang berarti request lewat proxy nginx, bukan langsung ke backend).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# template, bukan conf langsung: entrypoint image nginx nge-envsubst
# variabel env (mis. BACKEND_UPSTREAM) ke /etc/nginx/conf.d/default.conf saat start
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_UPSTREAM=backend:4000
ENV PORT=80
EXPOSE 80
