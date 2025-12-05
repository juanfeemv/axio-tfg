# Usamos una versión ligera de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# --- 1. Instalar Chromium y dependencias para Puppeteer ---
# Esto resuelve los problemas de Puppeteer al no encontrar el navegador en Docker (ARM/Alpine)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# --- 2. Variables de entorno para Puppeteer ---
# Le decimos a Puppeteer dónde está el navegador instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copiamos archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el código
COPY . .

# Creamos carpeta uploads
RUN mkdir -p uploads

# 3. Compilamos TypeScript
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# 4. Comando de arranque (Usamos tsx directo para seguridad de rutas)
CMD ["npx", "tsx", "src/app.ts"]