FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# API dipanggil lewat path relatif /api, nginx yang teruskan ke backend
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# template, bukan conf langsung: entrypoint image nginx nge-envsubst
# variabel env (mis. BACKEND_UPSTREAM) ke /etc/nginx/conf.d/default.conf saat start
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_UPSTREAM=backend:4000
EXPOSE 80
