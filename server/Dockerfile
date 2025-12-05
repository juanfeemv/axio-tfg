FROM node:20-alpine

WORKDIR /app

# --- Instalar Chromium y dependencias para Puppeteer ---
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Le decimos a Puppeteer dónde está el navegador y que no se descargue el suyo
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 3000

CMD ["npx", "tsx", "src/app.ts"]