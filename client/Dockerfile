# ETAPA 1: Construcción (Build)
# Usamos una imagen de Node para compilar los archivos
FROM node:20-alpine as builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
# Instalamos dependencias
RUN npm install

# Copiamos el código fuente y archivos de configuración
COPY . .

# Compilamos React (genera la carpeta /dist)
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
# Usamos la imagen base de Nginx, que es pequeña y rápida
FROM nginx:alpine

# Copiamos la web compilada desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos la configuración de Nginx (para las redirecciones /api)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto
EXPOSE 80

# Comando para arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]