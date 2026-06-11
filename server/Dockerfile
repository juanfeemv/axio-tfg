# Usamos Debian Bookworm Slim (ARM64 compatible, mejor soporte de Chromium que Alpine)
FROM node:20-bookworm-slim

# Directorio de trabajo
WORKDIR /app

# --- 1. Instalar Chromium y dependencias para Puppeteer ---
# En Debian/ARM64 (Raspberry Pi), instalamos Chromium del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-common \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# --- 2. Variables de entorno para Puppeteer ---
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

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

# 4. Comando de arranque con tsx (el polyfill __name se importa desde app.ts)
CMD ["npx", "tsx", "src/app.ts"]