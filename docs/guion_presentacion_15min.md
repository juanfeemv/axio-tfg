# Guion de Presentación — Defensa TFG AXIO (15 minutos)

---

## TIMELINE

| Minuto | Diapositiva | Qué dices |
|---|---|---|
| 0:00-1:00 | 1 — Portada | Presentación personal. Título del proyecto. |
| 1:00-3:00 | 2 — Problema | 3 problemas del sector. ¿Por qué hace falta Axio? |
| 3:00-4:30 | 3 — Objetivos | Generales y específicos. Metodología SCRUM. |
| 4:30-6:30 | 4 — Tecnologías | Stack completo: frontend, backend, infra, IA. |
| 6:30-9:00 | 5 — Demo en vivo | Auditoría URL, filtros empatía, pines, comunidad. |
| 9:00-11:00 | 6 — Arquitectura | Docker + Raspberry Pi + Cloudflare. Modelo de datos. |
| 11:00-12:30 | 7 — Pruebas y admin | 28 casos, 92.8%. Panel admin. Seguridad. |
| 12:30-14:00 | 8 — Conclusiones | Objetivos cumplidos. Qué he aprendido. |
| 14:00-15:00 | 9 — Trabajos futuros | 8 líneas de continuidad. Cierre y gracias. |

---

## DIAPOSITIVA 1 — PORTADA (1 min)

**Slide:** Título AXIO, tu nombre, Silvia Orenes, DAW, logo.

**Di:** "Buenos días/tardes. Soy Juan Felipe Mena, del ciclo de Desarrollo de Aplicaciones Web. Mi tutora es Silvia Orenes Quiñones. Mi proyecto se llama Axio: una plataforma colaborativa de auditoría y mejora de accesibilidad para proyectos digitales."

---

## DIAPOSITIVA 2 — EL PROBLEMA (2 min)

**Slide:** 3 iconos con texto breve: persona sola, piezas desconectadas, lupa rota.

**Di:** "Antes de enseñar la aplicación, vamos al problema que resuelve. En el mundo del desarrollo web actual hay 3 problemas:

**1. Aislamiento creativo.** Los creadores trabajan solos. No hay un sitio donde subir un diseño o un boceto y recibir feedback técnico y constructivo. Las redes sociales no tienen herramientas de revisión.

**2. Fragmentación diseño-desarrollo.** Los diseñadores trabajan en Figma, los desarrolladores en VS Code. No hay un punto intermedio donde validar que lo diseñado es accesible antes de programarlo. El resultado: productos que cumplen el diseño pero fallan en accesibilidad.

**3. Herramientas limitadas.** Lighthouse y WAVE analizan el DOM y son muy buenas detectando errores de sintaxis. Pero no analizan imágenes sueltas, no analizan PDFs, no simulan cómo ve la interfaz una persona con discapacidad visual, y no permiten colaboración entre personas.

Axio nace para resolver estos tres problemas en una sola plataforma."

---

## DIAPOSITIVA 3 — OBJETIVOS Y METODOLOGÍA (1:30 min)

**Slide:** Columna izquierda: objetivos. Columna derecha: metodología.

**Di:** "Los objetivos generales son tres: diseñar una aplicación web Full-Stack funcional, fomentar la colaboración entre creadores, y facilitar el cumplimiento de normativas de accesibilidad como el Acta Europea de 2025.

Los objetivos específicos: usar TypeScript en todo el stack, integrar IA de Google Gemini para análisis multimodal, implementar colaboración en tiempo real con WebSockets, desplegar en Docker sobre una Raspberry Pi 5, y desarrollar filtros de simulación de patologías visuales.

En cuanto a metodología, usé SCRUM adaptado al desarrollo individual. 6 Sprints de 2 semanas cada uno, gestionados con Trello. Cada Sprint producía un incremento funcional. El seguimiento diario lo hacía con tres preguntas: qué hice ayer, qué haré hoy, qué me bloquea."

---

## DIAPOSITIVA 4 — TECNOLOGÍAS (2 min)

**Slide:** Diagrama de 3 capas con iconos de cada tecnología.

**Di:** "El stack tecnológico se divide en tres capas.

**Frontend:** React con Vite y TypeScript. Tailwind CSS para los estilos. Axios para llamadas a la API. Socket.IO-client para tiempo real. Lucide para iconos.

**Backend:** Node.js con Express y TypeScript. MongoDB con Mongoose como base de datos. Puppeteer para scraping de webs. Multer para subida de archivos. JWT y bcryptjs para autenticación segura. Socket.IO para WebSockets.

**Infraestructura:** 7 contenedores Docker orquestados con Docker Compose: MongoDB, Mongo Express, Redis, backend, frontend con Nginx, n8n para automatizaciones, y cloudflared para exponer la app a Internet.

**IA:** Google Gemini 2.5 Flash, un modelo multimodal que procesa texto e imagen simultáneamente. Lo elegí frente a GPT-4 Vision porque tiene un tier gratuito suficiente para un proyecto académico y es más rápido."

---

## DIAPOSITIVA 5 — DEMO EN VIVO (2:30 min)

**Slide:** "Demo en vivo" o pantalla completa de la app.

**Di mientras navegas:**

"[0:00] Esto es la landing page. Animaciones, FAQs, información del proyecto. Voy a iniciar sesión con una cuenta de prueba.

[0:20] Este es el dashboard. Aquí centralizo todo: nueva auditoría, mis proyectos, comunidad, mensajes, configuración y panel de administración.

[0:40] Voy a auditar una URL. Escribo una dirección, le doy a analizar. El backend lanza Puppeteer, que abre un Chrome headless, renderiza la página completa —incluyendo JavaScript— y toma una captura de pantalla. Esa imagen se envía a Gemini 2.5 Flash, que la analiza con un prompt que le pide evaluar contraste, tipografía, legibilidad, carga cognitiva y usabilidad para personas con discapacidad. Gemini devuelve un JSON con una puntuación de 0 a 100 y una lista de incidencias.

[1:10] Aquí vemos el resultado: score y los issues detectados. Ahora aplico los filtros de empatía. Protanopia, deuteranopia, tritanopia —simulan daltonismo—, acromatopsia para escala de grises y desenfoque para baja visión. Esto permite a un desarrollador experimentar cómo ve su interfaz una persona con discapacidad visual.

[1:40] Puedo poner pines colaborativos. Hago clic en la imagen, escribo un comentario. Esto funciona con WebSockets: si otra persona está viendo el mismo proyecto, lo ve al instante. Las coordenadas son porcentuales, así el pin no se descuadra al redimensionar.

[2:10] En comunidad puedo ver proyectos de otros usuarios, filtrar, dar likes, votar. También hay mensajería directa y panel de administración con gestión completa de usuarios, proyectos y auditorías."

---

## DIAPOSITIVA 6 — ARQUITECTURA Y DESPLIEGUE (2 min)

**Slide:** Diagrama de contenedores Docker + Raspberry Pi.

**Di:** "La arquitectura se compone de 7 contenedores Docker en una red interna. MongoDB como base de datos, el backend con Node.js y Express, el frontend compilado servido por Nginx que actúa como proxy inverso hacia el backend, Mongo Express como visor web de la base de datos, n8n para automatizaciones, y cloudflared como túnel.

Lo diferencial aquí es el despliegue. No uso AWS ni Vercel. La aplicación corre 24 horas en una Raspberry Pi 5 con 8GB de RAM, arquitectura ARM64, y un consumo eléctrico inferior a 15 vatios. El túnel Cloudflare expone la app a Internet con HTTPS y SSL automático, sin necesidad de abrir puertos en el router ni tener IP pública fija. Cualquier persona accede desde el navegador sin instalar nada.

El backend sigue el patrón MVC: 9 modelos, 9 controladores, 9 rutas. La base de datos tiene 9 colecciones con relaciones mediante ObjectId. La API tiene 54 endpoints documentados con autenticación JWT y rate-limiting."

---

## DIAPOSITIVA 7 — PRUEBAS Y SEGURIDAD (1:30 min)

**Slide:** Resultados de pruebas + medidas de seguridad.

**Di:** "Se ejecutaron 28 casos de prueba entre unitarias, funcionales, de integración y manuales. El 92,8% se superaron. Los 2 fallos detectados se corrigieron durante el desarrollo: un error de redondeo en las coordenadas de los pines y una diferencia de saturación en el filtro de tritanopía entre navegadores.

En seguridad: contraseñas hasheadas con bcryptjs, autenticación sin estado con JWT de 7 días de expiración, rate-limiting en endpoints sensibles —10 peticiones cada 15 minutos para login—, validación de archivos por tipo MIME y extensión con Multer, cabeceras de seguridad con Helmet, y CSP configurado.

El panel de administración permite gestionar usuarios —suspender, reactivar, resetear contraseñas—, proyectos —ocultar, destacar—, auditorías —exportar a CSV—, y configuración global del sitio. Todas las acciones quedan registradas en un activity log."

---

## DIAPOSITIVA 8 — CONCLUSIONES (1:30 min)

**Slide:** Frases clave + foto de la Raspberry Pi.

**Di:** "Los objetivos se han cumplido. Se ha desarrollado una plataforma web Full-Stack funcional que integra IA multimodal, colaboración en tiempo real y simulación sensorial.

TypeScript ha sido el lenguaje transversal, eliminando errores de tipado en tiempo de ejecución. Docker ha permitido un despliegue idéntico en desarrollo y producción. La Raspberry Pi 5 demuestra que el Edge Computing es viable para aplicaciones web de este tipo.

Lo que más he aprendido: integrar una API de IA generativa en un flujo real no es solo llamar a un endpoint —es diseñar prompts efectivos, manejar respuestas malformadas, implementar fallbacks, y validar que el resultado es útil para el usuario.

Lo más difícil técnicamente fue hacer funcionar Puppeteer en ARM64. Tuve que cambiar de Alpine a Debian, instalar Chromium del sistema, y crear un polyfill para un bug de esbuild con tsx.

Lo que más orgulloso me siento es del motor de empatía. Que un desarrollador pueda ver en tiempo real cómo su interfaz la experimenta una persona con daltonismo o baja visión."

---

## DIAPOSITIVA 9 — TRABAJOS FUTUROS Y CIERRE (1 min)

**Slide:** Lista de 8 trabajos futuros en 2 columnas.

**Di:** "Como trabajos futuros: implementar tests automatizados con Jest, integrar pasarela de pago para modelo SaaS, soporte multiidioma, conectar otros modelos de IA como GPT-4 Vision para análisis comparativos, automatizar correcciones de código, desarrollar app móvil nativa, configurar CI/CD con GitHub Actions, y ampliar el análisis a contenido multimedia como vídeos.

El código fuente completo está disponible en GitHub como proyecto open source. Muchas gracias. Quedo a su disposición para cualquier pregunta."

---

## RESUMEN DE TIEMPOS

| Diapositiva | Tema | Tiempo |
|---|---|---|
| 1 | Portada | 1:00 |
| 2 | Problema | 2:00 |
| 3 | Objetivos + metodología | 1:30 |
| 4 | Tecnologías | 2:00 |
| 5 | Demo en vivo | 2:30 |
| 6 | Arquitectura + despliegue | 2:00 |
| 7 | Pruebas + seguridad | 1:30 |
| 8 | Conclusiones | 1:30 |
| 9 | Trabajos futuros + cierre | 1:00 |
| **TOTAL** | | **15:00** |

---

## CONSEJOS PARA LA PRESENTACIÓN

- **Ensaya con cronómetro.** 15 minutos se pasan volando. Si la demo se alarga, acorta conclusiones.
- **La demo es lo más importante.** Si funciona bien, el tribunal se convence solo. Si falla, ten capturas de respaldo.
- **No leas las diapositivas.** Úsalas como apoyo visual con poco texto.
- **Mira al tribunal**, no a la pantalla.
- **Anticípate a la demo:** ten el navegador abierto con sesión iniciada antes de empezar.
- **Ten un plan B:** si internet o Gemini fallan, muestra capturas del flujo completo.
- **Controla los nervios:** respira antes de empezar. Los primeros 30 segundos son los peores, luego sale solo.
