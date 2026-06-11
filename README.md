_Ecosistema Full-Stack para auditoría de accesibilidad web con simulación sensorial, colaboración en tiempo real y soporte IoT mediante Raspberry Pi._
---

## 🚀 Descripción del Proyecto

**Axio** es una plataforma diseñada para auditar la accesibilidad de cualquier sitio web de forma visual, colaborativa y centrada en la experiencia del desarrollador.

A diferencia de los validadores tradicionales, Axio incorpora:

- **Simulación sensorial en tiempo real** (daltonismo, baja visión, desenfoque…).
- **Modo colaborativo** con “pines” y comentarios visibles sobre la propia interfaz auditada.
- **Integración con Raspberry Pi**, permitiendo interactuar con el sistema mediante hardware externo.
- **Dashboard moderno** con métricas, reportes y análisis detallados.

Su objetivo es ayudar a equipos y desarrolladores a detectar y comprender barreras de accesibilidad web de forma práctica e intuitiva.

---

## 📂 Características Principales

### 🔍 Auditoría Web
- Análisis estructural del DOM.
- Captura de pantalla automatizada.
- Reportes organizados por gravedad y categoría.
- Recomendaciones claras para corregir los problemas detectados.

### 🎨 Simulación Sensorial
Aplicación de filtros visuales sobre el sitio auditado:
- Daltonismo (protanopia, deuteranopia, tritanopia)
- Baja visión
- Desenfoque / cataratas
- Reducción de contraste

### 🗺️ Colaboración en Tiempo Real
- Varias personas pueden conectarse simultáneamente.
- Colocación de pines y notas directamente sobre la web.
- Comunicación mediante WebSockets.
- Historial de comentarios por usuario.

### 🍓 Integración con Raspberry Pi (IoT)
El sistema permite conectar hardware externo mediante:
- Raspberry Pi
- Node.js
- Comunicación WebSocket

Esta integración facilita ampliar capacidades con botones físicos, sensores u otros módulos conectados al GPIO.

### 📊 Dashboard de Control
- Puntuación global del sitio (0–100)
- Lista de errores filtrable
- Visualización de métricas
- Historial de auditorías anteriores

---
### 🔹 Frontend (React + Vite)
- React 18  
- Tailwind CSS  
- Socket.io-client  
- Framer Motion  
- Iframe sandboxed + filtros SVG  
- Capa colaborativa con coordenadas relativas

### 🔹 Backend (Node.js + Express)
- Express  
- Socket.io  
- Puppeteer (crawling y screenshots)  
- Mongoose  

### 🔹 Base de Datos (MongoDB)
Colecciones:
- **Audits**
- **Annotations**
- **Users**

### 🔹 Raspberry Pi
- Node.js  
- Comunicación WebSocket  
- Capacidad de lectura y escritura en GPIO  

---

## 🚢 Despliegue completo en Docker + Cloudflared

El proyecto puede ejecutarse entero dentro de Docker Compose y publicarse por
Internet mediante Cloudflare Tunnel sin abrir puertos del router.

### 1) Preparar variables
1. Copia `infra/docker/.env.example` a `infra/docker/.env`.
2. Completa `GEMINI_API_KEY`.
3. Si vas a usar el túnel por token, completa `CLOUDFLARE_TUNNEL_TOKEN`.

### 2) Levantar el stack
Desde `infra/docker/` ejecuta:

```bash
docker compose up -d --build
```

Esto levanta MongoDB, Redis, backend, frontend y n8n dentro de la red interna
de Docker.

### 3) Publicar por Cloudflared
Si tienes dominio propio, activa el perfil del túnel con token:

```bash
docker compose --profile tunnel up -d
```

Cloudflared se conecta al contenedor `frontend` y expone Axio con un único
dominio público. El frontend hace de entrada y redirige internamente las rutas
`/api`, `/uploads` y `/socket.io` al backend, así que no necesitas publicar el
backend ni la base de datos.

Si no tienes dominio, usa un Quick Tunnel temporal:

```bash
docker compose --profile quick-tunnel up
```

Cloudflared imprimirá una URL `trycloudflare.com` en los logs del contenedor.
Esa URL cambia cuando detienes y vuelves a levantar el túnel.

### 4) Qué queda expuesto
- Público: solo el dominio de Cloudflare o la URL temporal `trycloudflare.com`.
- Privado: MongoDB, Redis y backend quedan dentro de la red Docker.
- Opcional: `mongo-express` y `n8n` pueden mantenerse privados o publicarse
solo si tú decides exponerlos.

### 5) Si quieres usar Raspberry Pi
- Usa una Raspberry Pi 5 con Raspberry Pi OS o una distro ARM64 compatible.
- Asegúrate de tener Docker y Docker Compose instalados.
- Ejecuta exactamente los mismos comandos: el stack está pensado para ARM64.

---
