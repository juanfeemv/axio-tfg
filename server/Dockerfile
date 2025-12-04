# Usamos la misma versión de Node
FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalamos TODO (incluido librerías de desarrollo para que funcione tsx)
RUN npm install

# Copiamos el código
COPY . .

# Creamos carpeta uploads
RUN mkdir -p uploads

EXPOSE 3000

# COMANDO MÁGICO: Usamos el mismo que usas en local
CMD ["npx", "tsx", "src/app.ts"]