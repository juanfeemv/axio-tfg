# Apuntes para la Defensa del TFG — AXIO

**Alumno:** Juan Felipe Mena Vega  
**Tiempo presentación:** ~5 minutos (video) + preguntas (~10-15 min)

---

## 1. APUNTES RÁPIDOS (chuleta mental)

### Lo que NO puede faltar en tu discurso

| Tema | Qué decir |
|---|---|
| **Qué es** | Plataforma colaborativa de auditoría de accesibilidad con IA. Analiza webs, imágenes, PDFs y código. |
| **Problema** | Herramientas actuales solo miran sintaxis. No hay sitio donde validar accesibilidad visual antes de programar. |
| **Tecnologías** | Full-Stack TypeScript. React+Vite+Tailwind. Node+Express+MongoDB. Gemini 2.5 Flash. Puppeteer. Socket.IO. Docker. |
| **Arquitectura** | 7 contenedores Docker en Raspberry Pi 5 ARM64. Túnel Cloudflare para acceso público sin abrir puertos. |
| **IA** | Puppeteer captura la web → Gemini analiza la imagen → devuelve JSON con score (0-100) + issues. |
| **Empatía** | 5 filtros SVG/CSS: protanopia, deuteranopia, tritanopia, acromatopsia, desenfoque. |
| **Colaboración** | WebSockets con Socket.IO. Pines en tiempo real (<120ms). Chat y mensajería directa. |
| **BD** | MongoDB + Mongoose. 9 colecciones. 54 endpoints REST. |
| **Pruebas** | 28 casos ejecutados. 92,8% superados (26/28). |
| **API externa** | Gemini 2.5 Flash (gratuito). N8N para webhooks/notificaciones. |

### Datos rápidos para soltar

- **54 endpoints** REST documentados
- **9 colecciones** MongoDB (User, Project, Audit, Pin, Conversation, Message, Notification, Admin, SiteConfig)
- **7 contenedores** Docker (MongoDB, Mongo Express, Redis, Backend, Frontend/Nginx, n8n, Cloudflared)
- **6 Sprints** SCRUM de 2 semanas (diciembre 2025 - marzo 2026)
- **28 pruebas**, 26 superadas, 2 fallos corregidos
- **Raspberry Pi 5** 8GB RAM, <15W consumo
- **5 insignias** de gamificación
- **5 filtros** de simulación visual

---

## 2. PREGUNTAS FRECUENTES DEL TRIBUNAL

### ARQUITECTURA Y TECNOLOGÍA

**¿Por qué MongoDB y no SQL?**
> Los reportes de auditoría de la IA tienen estructura variable (cada análisis puede devolver campos distintos). MongoDB permite almacenar objetos JSON directamente sin migraciones de esquema. Además, los arrays embebidos (likes, ratings) evitan joins innecesarios en las consultas de comunidad.

**¿Por qué Puppeteer y no Cheerio o Axios?**
> Cheerio solo analiza HTML estático. Las webs modernas (React, Vue, Angular) necesitan ejecutar JavaScript para renderizarse. Puppeteer lanza un Chrome headless real, ejecuta el JS de la página y captura lo que ve el usuario final, incluyendo estilos CSS aplicados.

**¿Por qué Node.js/Express y no Django o Spring?**
> Node.js comparte lenguaje con el frontend (TypeScript), lo que permite reutilizar tipos e interfaces. Además, su modelo de E/S no bloqueante es superior para WebSockets y conexiones concurrentes en tiempo real.

**¿Cómo funciona el túnel Cloudflare?**
> El contenedor cloudflared establece una conexión saliente cifrada (QUIC) hacia la red de Cloudflare. Cloudflare expone esa conexión como un dominio HTTPS público. No necesito abrir puertos en el router, no necesito IP pública fija, y obtengo SSL automático gratuito.

**¿Por qué una Raspberry Pi y no un VPS?**
> Demuestra la viabilidad del Edge Computing: una app web completa funcionando en hardware de consumo doméstico con <15W. Cubre competencias de desarrollo + administración de sistemas. El coste es 0€ mensual frente a un VPS de pago.

**¿Para qué sirve Redis si no lo usas en el código?**
> Está aprovisionado en el docker-compose como contenedor listo para usar. En esta versión el rate-limiting se gestiona en memoria y las sesiones WebSocket residen en Node.js. Redis está preparado para escalar a múltiples instancias del backend compartiendo caché y sesiones. Es un trabajo futuro inmediato.

---

### IA Y ANÁLISIS

**¿Cómo le pasas la imagen a Gemini?**
> La imagen se convierte a base 64 y se envía como inlineData junto con un prompt de texto que instruye a Gemini a actuar como auditor WCAG 2.1. Gemini 2.5 Flash es multimodal: procesa texto e imagen simultáneamente.

**¿Qué pasa si Gemini falla o devuelve un error?**
> El controlador captura la excepción y aplica heurísticas propias: busca problemas de accesibilidad directamente en el DOM (imágenes sin alt, campos sin label, falta de landmarks, jerarquía de encabezados, etc.). Si tampoco hay contexto DOM, calcula el score desde 100 restando penalizaciones por cada heurística detectada.

**¿Cómo sabes que el análisis de Gemini es fiable?**
> No me fío ciegamente. El sistema aplica un score cap: si Gemini devuelve 0 issues, el score máximo es 35 automáticamente. Con 1 issue, máximo 48. Esto fuerza a que Gemini sea exhaustivo. También se complementa con heurísticas propias ejecutadas desde Puppeteer sobre el DOM real.

**¿Por qué Gemini y no GPT-4 Vision?**
> Gemini 2.5 Flash tiene un tier gratuito suficiente para un proyecto académico, es más rápido y su ventana de contexto es amplia. Para un TFG sin presupuesto, es la opción más viable.

---

### SEGURIDAD

**¿Cómo proteges las contraseñas?**
> Se hashean con bcryptjs (salt rounds: 10). Nunca se almacenan en texto plano. El campo password tiene `select: false` en Mongoose para que no se devuelva en consultas por defecto.

**¿Cómo funciona la autenticación?**
> JWT (JSON Web Token) con expiración de 7 días. El frontend almacena el token en localStorage. Un interceptor de Axios lo inyecta en cada petición. El middleware `protect` del backend verifica el token, comprueba que el usuario no esté suspendido, y adjunta el usuario a `req.user`.

**¿Qué pasa si el token expira?**
> El interceptor de Axios captura el error 401, limpia localStorage y redirige al login.

**¿Cómo evitas ataques de fuerza bruta?**
> Rate limiting propio en memoria (sin librerías externas): login 10 peticiones cada 15 minutos, reset de contraseña 5 peticiones cada 15 minutos. Se bloquea por IP.

---

### DESARROLLO Y METODOLOGÍA

**¿Cómo aplicaste SCRUM siendo solo una persona?**
> Adapté los roles a una sola persona. Usé Trello con tableros Kanban de 5 columnas (Backlog, To Do, En curso, Review, Terminado). Sprints de 2 semanas. Seguimiento diario respondiendo 3 preguntas: ¿qué hice ayer?, ¿qué haré hoy?, ¿hay algún impedimento?

**¿Cómo probaste el proyecto?**
> Cuatro tipos de pruebas: unitarias (funciones aisladas con tsx), funcionales (flujos completos con Postman), de integración (WebSockets + MongoDB) y manuales (responsive, usabilidad, motor de empatía). 28 casos totales, 92,8% superados.

**¿Cuánto tiempo tardaste?**
> 6 Sprints de 2 semanas cada uno = 3 meses de desarrollo (diciembre 2025 - marzo 2026). Más 2 meses adicionales para documentación, memoria y preparación de la defensa.

---

### DISEÑO Y UX

**¿Por qué Tailwind y no Bootstrap?**
> Bootstrap impone un diseño genérico. Tailwind es utility-first: construyo una interfaz completamente personalizada desde cero sin salir del HTML, y el tree-shaking elimina el CSS no usado en producción.

**¿Cómo funciona el motor de empatía?**
> Los filtros de daltonismo usan SVG `feColorMatrix` con matrices de color documentadas científicamente para cada tipo. La acromatopsía usa CSS `grayscale(100%)`. El desenfoque usa CSS `blur(4px)`. Todo se renderiza en tiempo real en el navegador sin modificar el DOM.

**¿La plataforma en sí misma es accesible?**
> Sí. Tiene skip-link para teclado, texto a voz con Web Speech API, navegación por teclado completa, atributos ARIA, contraste verificado WCAG AA, atributo `data-speech` en elementos interactivos.

---

### PREGUNTAS TRAMPA / DIFÍCILES

**"¿Esto no lo hace ya Lighthouse?"**
> Lighthouse analiza el DOM de una página renderizada. No analiza imágenes sueltas, PDFs, ni código fuente sin renderizar. No tiene simulación de daltonismo ni colaboración en tiempo real. Axio unifica todo eso en una sola herramienta.

**"¿Por qué no tienes tests automatizados?"**
> Está contemplado como trabajo futuro. En esta versión prioricé tener un MVP funcional completo. Las pruebas manuales y funcionales cubrieron los flujos críticos. Un suite de tests con Jest/Vitest sería el siguiente paso lógico.

**"¿Cómo escala esto a 1000 usuarios?"**
> La arquitectura de microservicios con Docker permite escalar horizontalmente los servicios stateless (backend, frontend) añadiendo réplicas. JWT es sin estado, no requiere sesiones en servidor. MongoDB ofrece sharding nativo. El cuello de botella sería la Raspberry Pi, pero la arquitectura es portable a cualquier cloud.

**"¿Qué harías diferente si empezaras de nuevo?"**
> Incluiría tests automatizados desde el Sprint 1 (TDD). Usaría una librería de componentes como Radix UI para la accesibilidad base. Empezaría con el pipeline CI/CD antes del Sprint 6.

**"¿Cuál fue el mayor desafío técnico?"**
> Hacer funcionar Puppeteer en la Raspberry Pi 5 con arquitectura ARM64. Tuve que cambiar de Alpine a Debian, instalar Chromium del sistema, y crear un polyfill para el helper `__name` de esbuild/tsx que no es compatible con puppeteer.

---

## 3. FRASES CLAVE PARA QUEDAR BIEN

- "El **valor diferencial** de Axio es que unifica IA multimodal, colaboración en tiempo real y simulación sensorial en una sola plataforma."
- "He desplegado **7 contenedores Docker en una Raspberry Pi 5 con túnel Cloudflare**, demostrando competencias tanto en desarrollo como en administración de sistemas."
- "La API tiene **54 endpoints documentados** con autenticación JWT, rate-limiting y permisos granulares."
- "El motor de empatía permite a un desarrollador **experimentar en primera persona** cómo ve su interfaz un usuario con discapacidad visual."
- "Se ejecutaron **28 casos de prueba** con un **92,8% de superación**. Los 2 fallos se detectaron y corrigieron durante el desarrollo."
- "El código fuente completo está disponible en **GitHub** como proyecto open source."
