# Guión Técnico - Video Demostración TFG Axio (~5 min)

**Formato:** Voz en off + captura de pantalla navegando la plataforma en vivo

---

## ESCENA 1 — PORTADA + PROBLEMA (25s)

**Pantalla:** Título AXIO, nombre, tutor, ciclo, logo.

**Audio:** "Axio, plataforma colaborativa de auditoría de accesibilidad para proyectos digitales. Soy Juan Felipe Mena, de Desarrollo de Aplicaciones Web, tutelado por Silvia Orenes."

**Pantalla:** 3 iconos animados: persona sola, piezas desconectadas, lupa limitada.

**Audio:** "Los creadores trabajan aislados, no hay un sitio donde validar accesibilidad visual antes de programar, y las herramientas actuales solo miran sintaxis. Axio lo resuelve unificando IA multimodal, colaboración en tiempo real y simulación de discapacidad visual en una sola plataforma."

---

## ESCENA 2 — LOGIN + DASHBOARD (20s)

**Pantalla:** Login → credenciales guardadas → entrar. Mostrar dashboard con pestañas.

**Audio:** "La autenticación usa JWT con contraseñas hasheadas con bcryptjs y protección rate-limit. El dashboard centraliza todas las funciones: nueva auditoría, mis proyectos, comunidad, mensajes, configuración y panel de administración."

**Pantalla:** Recorrer rápido las pestañas laterales.

---

## ESCENA 3 — ARQUITECTURA + RASPBERRY PI (30s)

**Pantalla:** Diagrama simplificado de contenedores Docker: Mongo → Backend ← Nginx ← Cloudflare Tunnel → Usuario.

**Audio:** "Técnicamente es Full-Stack con TypeScript en frontend y backend. El servidor usa Node.js, Express y una API REST de 54 endpoints. La base de datos es MongoDB con 9 colecciones modeladas con Mongoose. Todo se orquesta con Docker Compose en 7 contenedores: MongoDB, Redis, backend, frontend con Nginx, Mongo Express, n8n y cloudflared. La aplicación se despliega en una Raspberry Pi 5 ARM64 con acceso público mediante túnel Cloudflare sin abrir puertos del router. Cualquier persona puede acceder desde el navegador sin instalar nada."

**Pantalla:** Breve foto real de la Raspberry Pi o del docker-compose.yml.

---

## ESCENA 4 — AUDITORÍA DE UNA URL CON IA (1 min)

**Pantalla:** Pestaña "Nueva Auditoría" → "Web en Vivo". Escribir URL pública. Clic en analizar.

**Audio:** "La función principal es la auditoría con IA. Al introducir una URL, el backend ejecuta Puppeteer, un navegador headless que renderiza la página completa —incluyendo JavaScript— y toma una captura de pantalla. Esa imagen se envía a Google Gemini 2.5 Flash con un prompt que le pide actuar como auditor centrado en la experiencia real de usuarios con discapacidad."

**Pantalla:** Mostrar carga y resultado en ProjectView. Señalar el score y algún issue.

**Audio:** "Gemini analiza la captura evaluando contraste, legibilidad, jerarquía visual, carga cognitiva y usabilidad desde la perspectiva de una persona ciega, con baja visión, daltonismo o discapacidad cognitiva. Devuelve un JSON con puntuación de 0 a 100 y una lista de incidencias con el elemento afectado, el problema detectado, una sugerencia concreta y la severidad."

**Pantalla:** Volver a Nueva Auditoría → "Código Fuente". Subir un HTML. Mostrar resultado.

**Audio:** "El mismo flujo funciona para código fuente. Aquí el análisis busca atributos alt, roles ARIA, etiquetas de formulario, errores de HTML semántico y explica cómo afecta cada fallo a usuarios reales con lectores de pantalla o navegación por teclado."

---

## ESCENA 5 — MOTOR DE EMPATÍA (25s)

**Pantalla:** ProjectView. Aplicar los 5 filtros seguidos: protanopia, deuteranopia, tritanopia, acromatopsia, desenfoque. Mostrar la diferencia visual.

**Audio:** "El motor de empatía aplica filtros SVG y CSS en tiempo real para simular cómo ve la interfaz una persona con daltonismo o visión reducida. Protanopia, deuteranopia y tritanopia usan matrices de color feColorMatrix documentadas científicamente. La acromatopsia aplica escala de grises y el desenfoque simula baja visión. Todo se ejecuta en el navegador sin modificar el código original."

---

## ESCENA 6 — COLABORACIÓN EN TIEMPO REAL (30s)

**Pantalla:** Abrir proyecto. Hacer clic en 3 puntos distintos de la imagen para colocar pines. Escribir comentario. Mostrar que aparece en el chat lateral.

**Audio:** "La colaboración funciona con WebSockets mediante Socket.IO. Al entrar en un proyecto te conectas a su sala. Haces clic en cualquier punto de la imagen para colocar un pin. Las coordenadas se guardan en porcentaje, así el pin no se descuadra al redimensionar la ventana. El servidor persiste el pin en MongoDB y lo retransmite a todos los usuarios de la sala en menos de 120 milisegundos de media."

**Pantalla:** Clic en el avatar de un comentario → va al perfil del usuario.

**Audio:** "Puedes pulsar en el avatar o nombre de cualquier usuario para ir directamente a su perfil público."

---

## ESCENA 7 — COMUNIDAD Y PERFIL (20s)

**Pantalla:** Pestaña Comunidad. Mostrar proyectos. Filtrar por populares. Dar like. Votar con estrellas.

**Audio:** "En comunidad los usuarios publican sus proyectos. Se filtran por recientes, populares o mejor puntuados. El sistema de likes y votación de 1 a 5 estrellas recalcula la media en el backend tras cada voto."

**Pantalla:** Entrar a un perfil de usuario. Mostrar proyectos, estadísticas e insignias. Flecha de volver.

**Audio:** "Cada usuario tiene un perfil público con sus proyectos, estadísticas de actividad y las insignias ganadas por gamificación: primer proyecto, constancia, uso de IA, calidad y participación en comunidad."

---

## ESCENA 8 — MENSAJERÍA DIRECTA (15s)

**Pantalla:** Pestaña Mensajes. Mostrar conversación con otro usuario. Enviar un mensaje de texto.

**Audio:** "La mensajería directa permite chats privados entre usuarios con soporte para texto e imágenes. Las notificaciones llegan en tiempo real vía Socket.IO y los mensajes se marcan como leídos al abrir la conversación."

---

## ESCENA 9 — PANEL DE ADMINISTRACIÓN (25s)

**Pantalla:** Cuenta admin. Recorrer rápido: Resumen, Usuarios, Proyectos, Auditorías, Pines, Actividad, Configuración.

**Audio:** "Los administradores tienen panel completo. Pueden suspender o reactivar usuarios, ocultar o destacar proyectos, exportar auditorías a CSV, gestionar pines, y ver un registro de toda la actividad del sistema. La configuración global permite cerrar registros, activar modo mantenimiento o cambiar límites. El middleware requireAdmin verifica el rol y auto-genera los permisos si faltan."

---

## ESCENA 10 — PRUEBAS Y CONCLUSIONES (25s)

**Pantalla:** Texto con los resultados de pruebas: 28 casos, 92.8% superados.

**Audio:** "Se ejecutaron 28 casos de prueba entre unitarias, funcionales, de integración y manuales con un 92,8% de superación. Los fallos detectados se corrigieron: redondeo de coordenadas y saturación en filtro de tritanopía."

**Pantalla:** Volver a la portada con logo.

**Audio:** "En conclusión, Axio demuestra que es viable unificar IA multimodal para accesibilidad, colaboración en tiempo real y simulación sensorial en una sola plataforma web. Todo el código está disponible en GitHub como proyecto open source. Gracias."

---

## RESUMEN DE ESCENAS

| # | Escena | Tiempo |
|---|--------|--------|
| 1 | Portada + problema | 25s |
| 2 | Login + dashboard | 20s |
| 3 | Arquitectura + Raspberry Pi | 30s |
| 4 | Auditoría con IA (URL + código) | 60s |
| 5 | Motor de empatía (5 filtros) | 25s |
| 6 | Colaboración con pines + chat | 30s |
| 7 | Comunidad y perfil | 20s |
| 8 | Mensajería directa | 15s |
| 9 | Panel de administración | 25s |
| 10 | Pruebas + conclusiones | 25s |
| **TOTAL** | | **~4 min 45s** |

---

## NOTAS DE GRABACIÓN

- **Navegador:** Chrome en F11 (pantalla completa), sin DevTools ni extensiones a la vista, cursor visible.
- **Tema oscuro** de la app activado (se ve mejor en vídeo).
- **Cuentas preparadas:** Una cuenta normal con 2-3 proyectos ya auditados. Una cuenta admin con datos variados.
- **Precarga:** Deja abierta una pestaña con ProjectView cargado para la demo de IA por si Gemini tarda. Ten un HTML de ejemplo preparado para la auditoría de código.
- **Raspberry Pi:** Si grabas mostrando la app desde el túnel Cloudflare, mejor. Si no, en localhost también vale.
- **Audio:** Micrófono externo o de diadema. Prueba de sonido antes de grabar.
- **Resolución:** 1080p mínimo. El OBS graba bien en MP4.
