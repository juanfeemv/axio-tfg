# Guía para la Presentación PowerPoint del TFG — AXIO

**Alumno:** Juan Felipe Mena Vega  
**Ciclo:** Desarrollo de Aplicaciones Web  
**Tutor:** Silvia Orenes Quiñones  
**Convocatoria:** Junio 2025  
**Tiempo estimado de presentación:** 15-20 minutos

---

## Estructura recomendada (12-15 diapositivas)

---

### Diapositiva 1 — Portada
- Título: **AXIO — Plataforma colaborativa de auditoría y mejora de calidad para proyectos digitales**
- Nombre, ciclo, tutor, convocatoria
- Logo de AXIO
- Fondo limpio con el degradado de la marca (verde esmeralda → azul)

---

### Diapositiva 2 — Índice / Agenda
- ¿Qué es AXIO? (problema y solución)
- Objetivos
- Tecnologías empleadas
- Demo en vivo
- Arquitectura y despliegue (Raspberry Pi)
- Conclusiones

---

### Diapositiva 3 — El problema
**Título:** ¿Por qué AXIO?
- **Aislamiento creativo**: los creadores no tienen un entorno eficaz para recibir feedback visual y constructivo.
- **Fragmentación del flujo**: diseñadores y desarrolladores trabajan separados, sin un punto de convergencia para asegurar calidad y accesibilidad.
- **Herramientas limitadas**: Lighthouse/WAVE detectan sintaxis pero no interpretan el contexto humano ni visual.

> _Poner 3 iconos representando cada problema (persona sola, piezas desconectadas, lupa limitada)_

---

### Diapositiva 4 — La solución: AXIO
- Plataforma web que **unifica auditoría de accesibilidad con IA, colaboración en tiempo real y simulación sensorial**.
- Tres pilares:
  1. **Auditoría multimodal con IA** (URLs, imágenes, código)
  2. **Motor de empatía** (simulación de daltonismo y baja visión)
  3. **Colaboración síncrona** (pines, chat, comunidad)
- **Dirigido a**: desarrolladores, diseñadores UI/UX, consultores de accesibilidad, estudiantes.

---

### Diapositiva 5 — Objetivos
**Generales:**
- Diseñar una aplicación web Full-Stack funcional para gestión colaborativa de proyectos digitales.
- Fomentar la creatividad colectiva.
- Facilitar el cumplimiento de normativas de accesibilidad (WCAG 2.1 / Acta Europea 2025).

**Específicos:**
- TypeScript como lenguaje transversal
- Docker + Raspberry Pi 5 (Edge Computing)
- API de Google Gemini para análisis multimodal
- WebSockets para colaboración en tiempo real
- Filtros SVG para simulación visual

---

### Diapositiva 6 — Tecnologías (Stack visual)
**Diagrama de 3 capas:**

| Capa | Tecnologías |
|---|---|
| **Frontend** | React + Vite + TypeScript, Tailwind CSS, Socket.IO-client |
| **Backend** | Node.js + Express + TypeScript, Mongoose (MongoDB), JWT, Socket.IO, Puppeteer |
| **Infra** | Docker Compose, Nginx, Redis, n8n, Cloudflared, Raspberry Pi 5 ARM64 |

**Servicios externos:** Google Gemini 2.5 Flash (IA multimodal), Cloudflare Tunnel.

> _Mostrar un diagrama simple de las 3 capas con iconos de cada tecnología_

---

### Diapositiva 7 — Funcionalidades principales
- Auditoría de **URLs** (scraping con Puppeteer + análisis IA)
- Auditoría de **archivos** (imágenes, PDF, código HTML/CSS/JS)
- **Motor de empatía**: filtros de daltonismo (protanopía, deuteranopía, tritanopía, acromatopsía, visión borrosa)
- **Pines colaborativos**: anotaciones sobre la interfaz en tiempo real con WebSockets
- **Comunidad**: publicación, likes, votación por estrellas
- **Mensajería directa** entre usuarios
- **Panel de administración** con permisos granulares

> _Capturas de pantalla de cada funcionalidad. Esta diapositiva puede ser la demo en vivo._

---

### Diapositiva 8 — Modelo de datos
- **9 colecciones en MongoDB** (NoSQL):
  - User, Project, Audit, Pin, Conversation, Message, Notification, Admin, SiteConfig
- Relaciones mediante ObjectId (referencias, no documentos embebidos).
- Mostrar el **diagrama ER** (`docs/diagrama_er.md`).

> _Insertar una imagen del diagrama Mermaid o una versión simplificada_

---

### Diapositiva 9 — Flujo de auditoría con IA
**¿Cómo analiza AXIO una URL?**
1. Usuario introduce URL → Backend lanza Puppeteer
2. Puppeteer renderiza la página (Chrome headless) y captura screenshot + contexto DOM
3. Imagen + datos se envían a **Google Gemini 2.5 Flash**
4. Gemini devuelve JSON con: `score` (0-100), `issues[]` (elemento, problema, sugerencia, severidad)
5. Resultado se guarda en MongoDB (Project + Audit) y se muestra en el visor

**También:** análisis de código fuente (HTML/CSS/JS) con heurísticas propias + IA.

> _Mostrar un diagrama de flujo: URL → Puppeteer → Gemini → JSON → UI_

---

### Diapositiva 10 — Motor de empatía / Simulación sensorial
- **5 filtros visuales** aplicados con SVG `feColorMatrix` + CSS:
  - **Protanopía** (sin sensibilidad al rojo)
  - **Deuteranopía** (sin sensibilidad al verde)
  - **Tritanopía** (sin sensibilidad al azul)
  - **Acromatopsía** (escala de grises)
  - **Visión borrosa** (baja visión, blur 4px)
- Permite a los desarrolladores **experimentar** cómo ve la interfaz un usuario con discapacidad visual.

> _Mostrar una misma imagen con y sin filtros, lado a lado_

---

### Diapositiva 11 — Arquitectura y Despliegue (⭐ DIFERENCIAL)
**Título:** Edge Computing en Raspberry Pi 5
- **7 contenedores Docker** en una Raspberry Pi 5 (ARM64, 8 GB RAM, <15W):
  - MongoDB, Redis, Backend (Node), Frontend (Nginx), Mongo Express, n8n, Cloudflared
- **Túnel Cloudflare**: acceso público HTTPS sin abrir puertos del router, sin IP fija, SSL automático.
- **Nginx** como proxy inverso: `/api/` → backend, `/socket.io/` → WebSockets, `/uploads/` → archivos.
- **¿Por qué una Raspberry Pi?** Demostrar viabilidad de Edge Computing, control de datos, bajo coste energético, competencias en sysadmin + DevOps.

> _Mostrar el diagrama de arquitectura de contenedores Docker_

---

### Diapositiva 12 — Planificación (SCRUM adaptado)
**6 Sprints de 2 semanas (diciembre 2025 — marzo 2026):**
| Sprint | Foco |
|---|---|
| 1 | Cimientos: Docker, autenticación JWT |
| 2 | El Cerebro: Gemini, Puppeteer, Multer |
| 3 | Interfaz: React, Dashboard, rutas protegidas |
| 4 | UX: ProjectView, filtros SVG, visor de código |
| 5 | Comunidad: Socket.IO, PinLayer, likes, mensajería |
| 6 | Infraestructura: Dockerización final, Nginx, n8n, Raspberry Pi |

**Metodología:** SCRUM individual con Trello, tableros Kanban, definición de completado.

> _Mostrar una línea de tiempo visual con los 6 sprints_

---

### Diapositiva 13 — Demo en vivo (opcional, ocupa 3-5 min)
1. **Registro/Login** (rápido)
2. **Auditar una URL** (ej: `https://example.com`)
3. **Ver los resultados**: score, issues detectados, sugerencias
4. **Aplicar filtro de daltonismo** sobre la captura
5. **Poner un pin** colaborativo sobre la imagen
6. **Ver la comunidad** con proyectos publicados

> _Tener preparada una cuenta de demo y una URL que dé resultados interesantes_

---

### Diapositiva 14 — Resultados de pruebas
- **28 casos de prueba** ejecutados → **92.8% superados** (26/28)
- 2 fallos corregidos: redondeo de coordenadas, saturación en filtro tritanopía
- 1 incidencia de usabilidad corregida (volumen TTS)
- Tipos de pruebas: unitarias, funcionales, integración, manuales

---

### Diapositiva 15 — Conclusiones
- ✅ Objetivos alcanzados: plataforma Full-Stack funcional con IA, colaboración en tiempo real y simulación sensorial.
- ✅ TypeScript como lenguaje único en frontend y backend.
- ✅ Despliegue real en Raspberry Pi 5 con túnel Cloudflare (Edge Computing viable).
- ✅ Gemini 2.5 Flash efectivo para análisis multimodal de accesibilidad.

**Trabajos futuros:**
- Testing automatizado (Jest/Vitest)
- Pasarela de pago / modelo SaaS
- Soporte multilingüe
- App móvil nativa
- CI/CD con GitHub Actions

---

### Diapositiva 16 — ¿Preguntas? / Agradecimientos
- _"Gracias por su atención. ¿Alguna pregunta?"_
- Datos de contacto, enlace al repositorio, QR al proyecto.

---

## Consejos para la presentación

### Visual
- Usa la paleta de AXIO: verde `#3d9171`, azul `#23638a`, fondos oscuros `#0f172a`, texto blanco/gris.
- **Muchas capturas de pantalla reales** de la app funcionando. Menos texto, más imágenes.
- Usa iconos (Lucide, FontAwesome) para hacer las diapositivas más visuales.
- Una idea por diapositiva. No sobrecargues.

### Demo en vivo
- Ten la app ya cargada en otra pestaña antes de empezar.
- Prepara un proyecto de ejemplo ya auditado por si falla internet o la API de Gemini.
- Ten un plan B: si la demo falla, muestra capturas de pantalla del flujo completo.

### Discurso
- No leas las diapositivas. Úsalas como apoyo visual.
- Enfatiza lo **diferencial**: Raspberry Pi, túnel Cloudflare, motor de empatía, IA multimodal.
- La demo es lo más impactante. Dale prioridad.
- Controla el tiempo: ~2 min por diapositiva = 14 diapositivas en ~20 min.

### Preparación técnica
- Asegúrate de que la Raspberry Pi esté encendida y el túnel Cloudflare activo antes de la presentación.
- Ten el móvil con datos por si falla el WiFi.
- Lleva el código abierto en VS Code por si preguntan detalles técnicos.
- Prepara respuestas para preguntas típicas:
  - _"¿Por qué MongoDB y no SQL?"_ → Flexibilidad de esquemas para datos de auditoría.
  - _"¿Por qué Puppeteer y no otra herramienta?"_ → Renderiza SPA (React, Vue), no solo HTML estático.
  - _"¿Cómo escala esto?"_ → Arquitectura de microservicios con Docker permite escalado horizontal.
  - _"¿Coste mensual?"_ → 0€ (Gemini tier gratuito, Cloudflare túnel gratuito, Raspberry Pi ~15W).

---

## Checklist previo a la presentación
- [ ] PowerPoint terminado y exportado a PDF (por si falla el formato)
- [ ] App funcionando en Raspberry Pi con túnel activo
- [ ] Cuenta de demo creada (usuario: `demo` / contraseña simple)
- [ ] Proyecto de ejemplo ya auditado (URL que dé resultados variados)
- [ ] Capturas de pantalla de respaldo por si falla la demo
- [ ] Proyector/HDMI compatible con el portátil
- [ ] Cargador del portátil
- [ ] Ensayar al menos 2 veces cronometrando
