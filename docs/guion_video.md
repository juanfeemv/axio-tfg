# Guión Técnico - Video Defensa TFG Axio (5 min)

**Formato:** Voz en off + captura de pantalla navegando la plataforma


---

## ESCENA 1 — PORTADA + PROBLEMA (25 seg)

**Pantalla:** Título del proyecto, nombre, tutor, ciclo.

**Audio:** "Axio, plataforma colaborativa de auditoría de accesibilidad para proyectos digitales. Soy Juan Felipe Mena, de Desarrollo de Aplicaciones Web, tutelado por Silvia Orenes."

**Pantalla:** 3 iconos: aislamiento creativo, desconexión diseño-desarrollo, validación solo de sintaxis.

**Audio:** "Los creadores web trabajan aislados, no hay un sitio donde validar accesibilidad visual antes de programar, y las herramientas actuales solo miran la sintaxis del código. Axio resuelve esto unificando IA, colaboración en tiempo real y simulación de discapacidad visual."


---

## ESCENA 2 — QUÉ HACE AXIO + LOGIN RÁPIDO (20 seg)

**Pantalla:** Login rápido (ya con credenciales guardadas). Entrar al dashboard.

**Audio:** "La aplicación permite subir una web, una imagen de diseño, un PDF o código fuente y recibir una auditoría de accesibilidad con inteligencia artificial. La autenticación usa JWT con contraseñas hasheadas con bcrypt."

**Pantalla:** Dashboard con sus pestañas visibles.

**Audio:** "El dashboard centraliza todas las funciones en pestañas: nueva auditoría, mis proyectos, comunidad, mensajes, configuración y panel de administración."


---

## ESCENA 3 — ARQUITECTURA (30 seg)

**Pantalla:** Diagrama de contenedores Docker.

**Audio:** "Técnicamente es una aplicación Full-Stack con TypeScript en frontend y backend. El servidor usa Node.js con Express y una API REST de 44 endpoints. La base de datos es MongoDB con 9 colecciones modeladas con Mongoose. Todo se orquesta con Docker: 6 contenedores que incluyen MongoDB, Redis, backend, Nginx, Mongo Express y n8n para automatizaciones. El sistema está preparado para ejecutarse en una Raspberry Pi 5 con arquitectura ARM."

**Pantalla:** Diagrama MVC.

**Audio:** "El backend sigue el patrón MVC y el frontend es una SPA con React, Vite y Tailwind CSS, usando Context API para gestionar autenticación, WebSockets y tema visual."


---

## ESCENA 4 — AUDITORÍA CON IA (1 min)

**Pantalla:** Pestaña "Nueva Auditoría". Seleccionar "Web en Vivo". Escribir URL. Clic en analizar.

**Audio:** "La función principal es la auditoría con IA. Al introducir una URL, el backend ejecuta Puppeteer, un navegador headless que renderiza la página completa incluyendo JavaScript, y toma una captura de pantalla. Esa imagen se envía a Google Gemini 2.5 Flash con un prompt que le pide actuar como auditor WCAG 2.1."

**Pantalla:** Mostrar carga y resultado en ProjectView. Señalar score y lista de issues.

**Audio:** "Gemini devuelve un JSON con una puntuación de 0 a 100 y una lista de incidencias: qué elemento falla, el problema detectado, una sugerencia y la severidad. El mismo flujo funciona para imágenes de diseño y para código fuente, donde el análisis se hace sobre el contenido textual buscando atributos alt faltantes, etiquetas ARIA o errores de HTML semántico."


---

## ESCENA 5 — MOTOR DE EMPATÍA (25 seg)

**Pantalla:** ProjectView. Aplicar los 5 filtros seguidos: protanopia, deuteranopia, tritanopia, acromatopsia, desenfoque.

**Audio:** "El motor de empatía aplica filtros en tiempo real para simular cómo ve la interfaz una persona con daltonismo o visión reducida. Protanopia, deuteranopia y tritanopia usan matrices de color SVG documentadas. La acromatopsia aplica escala de grises y el desenfoque simula baja visión. Todo se ejecuta en el navegador sin modificar el código."


---

## ESCENA 6 — COLABORACIÓN EN TIEMPO REAL (30 seg)

**Pantalla:** Abrir proyecto. Colocar 3 pines en distintas zonas. Escribir comentario. Mostrar chat lateral.

**Audio:** "La colaboración funciona con WebSockets mediante Socket.IO. Al entrar en un proyecto te conectas a su sala. Haces clic en cualquier punto de la imagen para colocar un pin. Las coordenadas se guardan en porcentaje, así el pin no se descuadra al redimensionar. El servidor lo persiste en MongoDB y lo retransmite a todos los usuarios de la sala en menos de 120 milisegundos. También hay chat integrado y mensajería directa entre usuarios con soporte para imágenes."


---

## ESCENA 7 — COMUNIDAD (15 seg)

**Pantalla:** Pestaña Comunidad. Mostrar proyectos. Filtrar. Dar like. Votar con estrellas.

**Audio:** "En comunidad los usuarios publican sus proyectos. Se filtran por recientes, populares o mejor puntuados. Hay likes y votación de 1 a 5 estrellas. El backend recalcula la media tras cada voto. Las interacciones se reflejan al instante en la interfaz."


---

## ESCENA 8 — ADMINISTRACIÓN (25 seg)

**Pantalla:** Entrar como admin. Recorrer rápido: resumen, usuarios, proyectos, auditorías, pines, actividad, configuración.

**Audio:** "Los administradores tienen panel completo: pueden suspender usuarios, ocultar proyectos, exportar auditorías a CSV y ver un registro de toda la actividad. La configuración global permite cerrar registros, activar modo mantenimiento o cambiar límites de pines y tamaño de subida. El middleware requireAdmin verifica el rol y auto-genera los permisos si faltan."


---

## ESCENA 9 — PRUEBAS Y DESPLIEGUE (25 seg)

**Pantalla:** Tabla del plan de pruebas funcionales.

**Audio:** "Se ejecutaron 28 casos de prueba: unitarias, funcionales, de integración y manuales. El 92,8% se superaron. Los 2 fallos se corrigieron: un error de redondeo en coordenadas de pines y una diferencia de saturación en el filtro de tritanopía entre navegadores."

**Pantalla:** Foto de Raspberry Pi o docker-compose.yml.

**Audio:** "La aplicación se despliega con Docker Compose en una Raspberry Pi 5. Puppeteer detecta automáticamente Chromium en ARM. La comunicación WebSocket usa polling HTTP para funcionar tras túneles Cloudflare gratuitos."


---

## ESCENA 10 — CONCLUSIONES (15 seg)

**Pantalla:** Volver a la portada.

**Audio:** "Axio demuestra que es viable unificar IA multimodal, colaboración en tiempo real y simulación sensorial en una sola plataforma de accesibilidad. Todos los objetivos planteados se han cumplido. El código está disponible en GitHub. Gracias."


---

## RESUMEN DE ESCENAS Y TIEMPOS

| # | Escena | Duración |
|---|--------|----------|
| 1 | Portada + problema | 25s |
| 2 | Login + dashboard | 20s |
| 3 | Arquitectura técnica | 30s |
| 4 | Auditoría con IA (Gemini + Puppeteer) | 60s |
| 5 | Motor de empatía (5 filtros) | 25s |
| 6 | Colaboración con pines + chat | 30s |
| 7 | Comunidad (likes + estrellas) | 15s |
| 8 | Panel de administración | 25s |
| 9 | Pruebas (28 casos) + despliegue RPi | 25s |
| 10 | Conclusiones + cierre | 15s |
| **TOTAL** | | **~4 min 30s** |

Tienes 30 segundos de margen por si alguna escena se alarga.


## NOTAS DE GRABACIÓN

- **Navegador:** Chrome en F11 (pantalla completa), DevTools cerradas, resaltado de clics activado.
- **Tema oscuro:** Se ve mejor en vídeo.
- **Prepara antes de grabar:** Una cuenta de usuario con proyectos ya subidos. Una cuenta admin. Deja una pestaña con ProjectView ya cargado para no esperar a Gemini en directo.
- **Audio:** Micro externo. Haz prueba de sonido antes.
- **Resolución:** 1080p mínimo.
