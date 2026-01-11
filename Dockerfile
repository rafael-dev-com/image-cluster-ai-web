# Stage 1: build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Aquí pasamos la URL de la API al build
ARG API_URL
RUN sed -i "s|http://image-cluster-ai-api:8000|$API_URL|" src/environments/environment.prod.ts
RUN npm run build:prod

# Stage 2: Nginx
FROM nginx:alpine
COPY --from=build /app/dist/image-cluster-ai-web/browser  /usr/share/nginx/html
COPY --from=build /app  /app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
