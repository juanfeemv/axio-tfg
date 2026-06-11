# AXIO

Plataforma colaborativa de auditoría de accesibilidad web con IA, simulación sensorial y colaboración en tiempo real. Desplegada en Raspberry Pi 5 con Docker y túnel Cloudflare.

---

## 🚀 Demo en vivo

La aplicación está autoalojada 24/7 en una Raspberry Pi 5.

> URL generada mediante Cloudflare Tunnel.

---

## ⚡ Tecnologías

| Capa | Stack |
|--------|--------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Axios, Socket.IO Client, Lucide |
| **Backend** | Node.js, Express, TypeScript, Mongoose (MongoDB), Socket.IO, Puppeteer, Multer |
| **IA** | Google Gemini 2.5 Flash (análisis multimodal de accesibilidad) |
| **Infraestructura** | Docker Compose, Nginx, Redis, n8n, Cloudflared, Raspberry Pi 5 ARM64 |
| **Seguridad** | JWT, bcryptjs, Helmet, CORS, Rate Limiting |

---

## 🔍 Funcionalidades

### 🤖 Auditoría con IA

Analiza:

- URLs mediante Puppeteer + Gemini
- Imágenes
- PDFs
- Código fuente

Genera:

- Score de accesibilidad (0-100)
- Problemas detectados
- Recomendaciones automáticas

### 👁️ Motor de empatía

Simulación visual de diferentes discapacidades:

- Protanopia
- Deuteranopia
- Tritanopia
- Acromatopsia
- Desenfoque visual

Permite visualizar cómo percibe la interfaz una persona con discapacidad visual.

### 💬 Colaboración en tiempo real

- Pines colaborativos sobre capturas de proyectos
- WebSockets con Socket.IO
- Chat integrado
- Mensajería privada

### 🌐 Comunidad

- Publicación de proyectos
- Sistema de likes
- Valoraciones de 1 a 5 estrellas
- Filtros por:
  - Popularidad
  - Score
  - Fecha

### 🛠️ Panel de administración

Gestión completa de:

- Usuarios
  - Suspender
  - Reactivar
- Proyectos
  - Ocultar
  - Destacar
- Auditorías
  - Exportación CSV
- Configuración global
- Registro de actividad (Activity Log)

### 🏆 Gamificación

Insignias disponibles:

- Primer Proyecto
- Constante
- Análisis Activo
- Calidad +80
- Comunidad

### ♿ Accesibilidad de la propia plataforma

- Texto a voz (Web Speech API)
- Skip Links
- Navegación por teclado
- Roles ARIA
- Temas claro y oscuro

---

## 🐳 Despliegue con Docker

### Requisitos

- Docker
- Docker Compose
- API Key de Gemini

Obtén tu clave en:

https://aistudio.google.com/apikey

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/juanfeemv/axio-tfg.git

# 2. Entrar en Docker
cd axio-tfg/infra/docker

# 3. Crear variables de entorno
cp .env.example .env

# Editar:
# GEMINI_API_KEY=tu_api_key
# JWT_SECRET=tu_secreto

# 4. Levantar servicios
docker compose up -d --build
```

### Quick Tunnel (opcional)

```bash
docker compose --profile quick-tunnel up -d
```

La URL `trycloudflare.com` aparecerá en los logs del contenedor.

### Dominio propio con Cloudflare Tunnel

Configura:

```env
CLOUDFLARE_TUNNEL_TOKEN=tu_token
```

y ejecuta:

```bash
docker compose --profile tunnel up -d
```

---

## 📦 Servicios desplegados

| Contenedor | Puerto | Descripción |
|------------|---------|-------------|
| mongo | 27017 | MongoDB |
| mongo-express | 8081 | Administrador web de MongoDB |
| redis | 6379 | Caché |
| backend | 3000 | API REST + WebSockets |
| frontend | 80 | Nginx + React SPA |
| n8n | 5678 | Automatización y workflows |
| cloudflared | — | Túnel Cloudflare |

---

## 🗄️ Base de datos

MongoDB gestionado mediante Mongoose.

### Colecciones

| Colección | Descripción |
|------------|-------------|
| users | Usuarios registrados |
| projects | Proyectos auditados |
| audits | Resultados de auditorías |
| pins | Comentarios colaborativos |
| notifications | Notificaciones |
| conversations | Conversaciones privadas |
| messages | Mensajes |
| admins | Permisos administrativos |
| siteconfigs | Configuración global |

Documentación adicional:

```txt
docs/base_de_datos.md
docs/diagrama_er.md
```

---

## 📡 API REST

La plataforma dispone de **54 endpoints** protegidos mediante JWT y Rate Limiting.

| Módulo | Endpoints |
|---------|-----------|
| Auth | 8 |
| Analyze | 2 |
| Projects | 7 |
| Pins | 3 |
| Users | 2 |
| Messages | 6 |
| Notifications | 3 |
| Stats | 1 |
| Admin | 22 |

### Principales funcionalidades API

#### Auth

- Registro
- Login
- Perfil
- Cambio de contraseña
- Avatar
- Recuperación de contraseña

#### Analyze

- Análisis de URL
- Análisis de archivos

#### Projects

- CRUD completo
- Likes
- Valoraciones
- Comunidad

#### Admin

- Gestión de usuarios
- Gestión de proyectos
- Gestión de auditorías
- Estadísticas
- Configuración global

---

## 🍓 Raspberry Pi 5

AXIO está optimizado para ejecutarse en una:

**Raspberry Pi 5 (8 GB RAM - ARM64)**

Características:

- Consumo inferior a 15W
- Funcionamiento 24/7
- Chromium ARM64 nativo para Puppeteer
- Debian Bookworm Slim
- Cloudflare Tunnel sin apertura de puertos

---

## 📂 Estructura del proyecto

```txt
server/
└── src/
    ├── app.ts
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── services/
    └── utils/

client/
└── src/
    ├── pages/
    ├── context/
    ├── components/
    └── services/

infra/
└── docker/
    ├── docker-compose.yml
    └── cloudflared/
```

### Backend

- Express
- Socket.IO
- MongoDB
- JWT
- Puppeteer

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Axios
- Context API

---

## 📚 Documentación del TFG

```txt
docs/
├── TFG_memoria.md
├── apuntes_defensa.md
├── guion_presentacion_15min.md
├── base_de_datos.md
└── diagrama_er.md
```

---

## 🎯 Objetivo

AXIO nace con el objetivo de facilitar la evaluación de accesibilidad web mediante inteligencia artificial, herramientas colaborativas y simulación de discapacidades visuales, ayudando a desarrolladores, diseñadores y organizaciones a construir experiencias digitales más inclusivas.

---

## 📄 Licencia

Proyecto desarrollado como Trabajo Fin de Grado (TFG).

© Juan Fernández
