AXIO
Plataforma colaborativa de auditoría y mejora de calidad para proyectos digitales.
CONVOCATORIA: Junio 2026
ALUMNO/A: Juan Felipe Mena Vega
TUTOR/A: Silvia Orenes Quiñones
CICLO: Desarrollo de Aplicaciones Web
2
ÍNDICES
Tabla de contenido.
CAPITULO 1. INTRODUCCIÓN....................................................................................................5
1. ABSTRACT.................................................................................................................................5
2. INTRODUCCIÓN......................................................................................................................5
2.1 Justificación.....................................................................................................................5
2.2 Planteamiento del problema / Contexto .............................................................6
2.3 Objetivos del trabajo....................................................................................................6
3. MOTIVACIÓN............................................................................................................................7
3.1 Fundamentos conceptuales del proyecto............................................................7
4. METODOLOGÍAS EMPLEADAS..........................................................................................9
4.1 Metodología de desarrollo. .......................................................................................9
CAP 2. MARCO TEÓRICO O ESTADO DE LA CUESTIÓN. ................................................ 10
1. ANÁLISIS DEL CONTEXTO............................................................................................... 10
2. TECNOLOGÍAS EMPLEADAS........................................................................................... 10
2.1 Hardware necesario.................................................................................................. 11
2.2 Software necesario y Stack Tecnológico........................................................... 11
2.3 Patrón de arquitectura ............................................................................................ 14
CAP. 3 DESARROLLO ESPECÍFICO DE LA CONTRIBUCIÓN......................................... 15
1. ALCANCE..................................................................................................................................... 15
1.1 Requisitos funcionales............................................................................................. 15
1.2 Requisitos no funcionales....................................................................................... 16
1.3 Funcionalidades no incluidas en esta versión. ............................................... 17
2. PLANIFICACIÓN........................................................................................................................ 18
2.1 Planificación de tareas............................................................................................. 20
2.2 Metodología de seguimiento. ................................................................................ 21
2.3 Hitos del proyecto...................................................................................................... 22
2.4 Tabla de planificación. ............................................................................................. 24
2.5 Definición del MVP. ................................................................................................... 25
3. DESARROLLO DEL PROYECTO ...................................................................................... 25
3.1 Análisis........................................................................................................................... 25
3.2 Diseño............................................................................................................................. 30
3.3 Implementación.......................................................................................................... 31
3
3.3.4 Despliegue en Raspberry Pi 5 con túnel Cloudflare................................... 35
3.4 Fase de pruebas y QA. .............................................................................................. 35
CAP 4. CONCLUSIONES y TRABAJOS FUTUROS................................................................ 39
1. CONCLUSIONES. ....................................................................................................................... 39
2. TRABAJOS FUTUROS. ............................................................................................................. 40
CAPITULO 5. REFERENCIAS..................................................................................................... 41
CAPITULO 6. ANEXOS................................................................................................................. 43
4
Índice de figuras/imágenes
Figura 1: Diagrama del patrón MVC...........................................................................14
Figura 2: Contenedores Docker ...................................................................................14
Figura 3: Esquema de seguimiento ..............................................................................18
Figura 4: Tabla Trello de Anteproyecto.......................................................................22
Figura 5: Tabla Trello de Análisis. ..............................................................................23
Figura 6: Tabla Trello de Plan de pruebas...................................................................23
Figura 7: Tabla Trello del Desarrollo ..........................................................................24
Figura 8: Modelo lógico de Colecciones .....................................................................29
Figura 9: Diagrama de relaciones entre colecciones....................................................30
Figura 10. Panel de Administración: Resumen............................................................43
Figura 11. Panel de Administración: Usuarios ............................................................44
Figura 12. Panel de Administración: Proyectos...........................................................45
Figura 13. Panel de Administración: Auditorías..........................................................45
Figura 14. Panel de Administración: Pines..................................................................46
Figura 15. Panel de Administración: Actividad...........................................................46
Figura 16. Panel de Administración: Configuración. ..................................................47
Figura 17. Dashboard...................................................................................................47
Figura 18: Mis Proyectos.............................................................................................48
Figura 19: Comunidad .................................................................................................48
Figura 20: Vista del Proyecto.......................................................................................49
Figura 21: Perfil de Usuario: Proyectos.......................................................................49
Figura 22: Perfil de Usuario: Estadísticas....................................................................50
Figura 23: Perfil de Usuario: Insignias. .......................................................................50
Figura 24: Mensajes.....................................................................................................51
Figura 25: Configuración: Edición de Perfil................................................................51
Figura 26: Configuración: Edición de contraseña / Apariencia / Eliminación de
cuenta. ..........................................................................................................................52
Índice de tablas.
Tabla 1: Cronograma de planificación.........................................................................24
Tabla 2: Ciclo de pruebas 1..........................................................................................38
Tabla 3: Ciclo de pruebas 2..........................................................................................38
Tabla 4. Rutas de Auteticación. ...................................................................................52
Tabla 5: Rutas de Análisis ...........................................................................................52
Tabla 6: Rutas de Proyectos.........................................................................................53
Tabla 7: Rutas de Pines................................................................................................53
Tabla 8: Rutas de Usuarios ..........................................................................................53
Tabla 9: Rutas de Mensajes .........................................................................................53
Tabla 10: Rutas de Notificaciones...............................................................................53
Tabla 11: Rutas de Estadísticas....................................................................................53
Tabla 12: Rutas de Administración..............................................................................54
5
CAPITULO 1. INTRODUCCIÓN
1. ABSTRACT
Axio es una plataforma web colaborativa diseñada para auditar, revisar y mejorar
productos digitales (webs, diseños o documentos). A diferencia de los validadores
tradicionales utiliza IA generativa multimodal para analizar no solo la sintaxis del
código, sino también el contexto semántico y la accesibilidad.
Incluye simulaciones sensoriales para ayudar a los desarrolladores a detectar barreras
para personas con discapacidades visuales. Se centra en la calidad visual y la
experiencia del usuario.
2. INTRODUCCIÓN
Se ha buscado demostrar la viabilidad técnica de una herramienta capaz de detectar
barreras no solo en código, sino también en diseños visuales, facilitando la colaboración
entre personas mediante una infraestructura propia basada en una arquitectura basada
en servicios contenerizados.
2.1 Justificación
La pertinencia de este proyecto es doble. Por un lado, responde a la urgente necesidad
de adaptación ante la entrada en vigor del Acta Europea de Accesibilidad en 2025,
exigiendo el cumplimiento de los estándares WCAG 2.1 (Web Content Accessibility
Guidelines). Por otro lado, atiende a una demanda social creciente: la necesidad de
espacios digitales donde la creatividad no sea un proceso solitario, sino una experiencia
compartida y enriquecida por la comunidad.
Axio justifica su existencia transformando la revisión de proyectos en un flujo de
trabajo visual, proactivo y profundamente social. Al permitir la interacción sobre
bocetos o ideas en fases tempranas, no solo asegura accesibilidad, sino ayuda a que las
ideas mejoren desde el principio, facilitando que cualquiera pueda revisar y aportar.
6
2.2 Planteamiento del problema / Contexto
En el ecosistema actual del desarrollo de productos digitales, se detectan tres
problemáticas estructurales:
1. Aislamiento creativo: Los creadores a menudo carecen de un entorno eficaz
donde recibir feedback visual y constructivo sobre sus ideas en etapas iniciales.
Las redes sociales genéricas no ofrecen herramientas técnicas para una revisión
profunda.
2. Fragmentación del flujo de trabajo: Existe una desconexión operativa entre
los equipos de diseño y los de desarrollo. No existe un entorno intermedio eficaz
que actúe como punto de convergencia para asegurar la calidad, accesibilidad y
evolución creativa del producto.
3. Limitaciones de la validación automatizada: Las herramientas de auditoría
predominantes son eficaces para detectar errores de sintaxis, pero fallan al
interpretar el contexto humano y creativo.
Axio aborda esta problemática creando un entorno unificado donde la IA y las
herramientas de colaboración en tiempo real actúan como puente, permitiendo que la
comunidad participe activamente en la evolución de los proyectos.
2.3 Objetivos del trabajo
Partiendo de la problemática de la fragmentación en las herramientas de calidad y la
falta de espacios para la colaboración, se definen los siguientes objetivos.
2.3.1 Objetivos Generales:
• Diseñar y desarrollar una aplicación web Full-Stack (SaaS) funcional que
permita la gestión integral y colaborativa de proyectos digitales.
• Fomentar la creatividad colectiva y el intercambio de ideas,
proporcionando un espacio donde los usuarios puedan interactuar y
expandir sus conceptos con la ayuda de la comunidad.
• Facilitar el cumplimiento de las normativas de accesibilidad mediante el
uso de asistentes inteligentes y simuladores visuales.
2.3.2 Objetivos Específicos:
• Utilizar TypeScript como lenguaje transversal para garantizar la robustez
y escalabilidad del código.
• Implementar una arquitectura basada en servicios contenerizados con
Docker sobre una Raspberry Pi 5, demostrando competencias en
DevOps.
7
• Integrar la API de Google Gemini para realizar análisis multimodales de
los archivos subidos.
• Desarrollar un sistema de comunicación en tiempo real (WebSockets)
para permitir la colocación de anotaciones ("pines") y comentarios que
enriquezcan creativamente los proyectos.
• Implementar filtros de procesamiento de imagen en el frontend para la
simulación de patologías visuales.
3. MOTIVACIÓN
La elección de este proyecto surge de la ambición personal de integrar las áreas de
conocimiento más relevantes durante el ciclo: el desarrollo de software robusto y la
administración de sistemas, añadiendo el uso de la inteligencia artificial.
Asimismo, el nombre del proyecto, "Axio", no ha sido elegido al azar. Proviene del
término griego axioma, que significa "lo que se considera justo", y del concepto
"axioma", entendido como una verdad fundamental. Esta denominación refleja la
filosofía principal de mi proyecto: considerar la accesibilidad y la calidad como pilares
esenciales e innegociables.
La motivación principal reside en la creación de un producto con utilidad social tangible,
que sirva no solo como herramienta de validación, sino como un espacio de
colaboración creativa donde desarrolladores, diseñadores y creadores pueden ayudarse
mutuamente a construir un internet más inclusivo y mejor diseñado.
3.1 Fundamentos conceptuales del proyecto
Para fundamentar el desarrollo de Axio, hace falta definir los conceptos técnicos que
sustentan la solución propuesta:
A) Fundamentos de la Accesibilidad y Calidad Digital.
• Accesibilidad Web (WAI): Cualidad que garantiza el acceso universal a
contenidos digitales independientemente de las capacidades cognitivas o
físicas del usuario.
• Metodología Shift-Left Testing: Estrategia de calidad que propone el
desplazamiento de las pruebas a las etapas iniciales del ciclo de vida del
desarrollo.
Se implementa la validación de prototipos visuales y bocetos (JPG/PNG)
antes de la fase de codificación, permitiendo la detección de errores de
contraste y jerarquía visual.
8
B) Fundamentos Técnicos.
Arquitectura de Software (Stack Tecnológico).
• Full-Stack TypeScript: Utilización de un lenguaje unificado y fuertemente
tipado en todas las capas de la aplicación para garantizar la consistencia de
tipos y reducir errores en tiempo de ejecución.
• Interfaz del usuario: La interfaz del proyecto se desarrolla con React y Vite,
lo que permite actualizar el contenido y gestionar la navegación de manera
dinámica desde el lado cliente. El diseño se construye con Tailwind CSS,
siguiendo un enfoque escalable.
• Contenerización: Despliegue modular de servicios (Base de datos NoSQL,
Caché, Servidor de Aplicaciones) dirigidos mediante Docker, asegurando
la portabilidad y el aislamiento de procesos.
Backend y Automatización.
• Entorno de ejecución: Node.js con Express para la creación de una API
REST eficiente.
• Navegación Programática: Uso de la librería Puppeteer para renderizar
páginas web dinámicas (CSR) en el servidor, permitiendo la captura del
DOM y capturas de pantalla necesarias para el análisis visual.
• Gestión de Archivos: Implementación de Multer para el manejo de streams
de datos multipart/form-data, permitiendo la subida eficiente de imágenes
y PDFs.
Inteligencia Artificial Generativa Multimodal.
• LLM (Large Language Models): Integración de modelos transformadores
(Google Gemini) capaces de procesar tokens de texto y embeddings visuales
simultáneamente. Esto permite la interpretación contextual de interfaces
gráficas.
Gestión de Base de Datos.
• Modelo No Relacional (NoSQL): Uso de MongoDB para gestionar
estructuras de datos flexibles y jerárquicas (documentos JSON), ideal para
almacenar reportes de auditoría variables y metadatos de anotaciones
colaborativas.
9
Comunicación en Tiempo Real.
• Protocolo WebSocket: Establecimiento de canales bidireccionales
persistentes (Full-Duplex) mediante Socket.io para la sincronización de
estado (pines, comentarios) entre múltiples clientes con latencia mínima.
C) Contexto científico y Normativo.
Marco Legal Europeo.
• Datos Clave: La Directiva (UE) 2019/882 (Acta Europea de Accesibilidad)
establece requisitos de accesibilidad obligatorios para productos y servicios a
partir de junio de 2025, generando una necesidad crítica de herramientas de
auditoría eficientes en el mercado.
• Edge Computing: Procesamiento de datos realizado cerca de la fuente de
origen en lugar de en una nube centralizada.
Se implementa el despliegue de la infraestructura de persistencia y entornos
de prueba en una Raspberry Pi 5 local, manteniendo el control sobre los
datos.
4. METODOLOGÍAS EMPLEADAS
El proyecto se ha organizado siguiendo una metodología ágil e iterativa.
4.1 Metodología de desarrollo.
Se empleará la metodología SCRUM, adaptado al desarrollo individual. El ciclo
de vida se estructurará en "Sprints" de dos semanas de duración. Al finalizar cada
Sprint, se obtendrá un incremento funcional del software.
Para el control de versiones, la integración continua y la gestión de tareas, se
utilizará Github.
10
CAP 2. MARCO TEÓRICO O ESTADO DE LA
CUESTIÓN.
1. ANÁLISIS DEL CONTEXTO
El proyecto responde a la necesidad de validad la accesibilidad web de forma temprana
y objetiva cumpliendo con la normativa europea de 2025. Actualmente, los
profesionales disponen de herramientas aisladas, pero no existe una plataforma
unificada que combine análisis multimodal, simulación visual, colaboración en tiempo
real y publicación social.
Entre las soluciones existentes destacan:
• Lighthouse / Wave: Analizan accesibilidad, pero no permiten simulación
empática ni colaboración ni análisis de imágenes o PDFs.
• Figma / Adobe: Ofrece filtros de daltonismo y comprobación de contraste, pero
no integra análisis mediante IA ni soporte para código o URLs.
• Herramientas de Scraping tradicionales: No son capaces de renderizar webs
modernas basadas en JavaScript.
• Plataformas de comunidad: Permiten compartir proyectos, pero sin validación
técnica ni colaboración de tipo pin sobre imagen.
El carácter diferenciador de Axio se fundamenta en:
• Un análisis de accesibilidad multimodal mediante IA, capaz de procesar
imágenes, PDFs, código y páginas web.
• Motor de empatía con filtros en tiempo real.
• Colaboración síncrona con WebSockets, permitiendo interacción directa
mediante pines y chat.
• Un enfoque unificado: carga de archivos, scraping, análisis, simulación y
publicación en un solo entorno.
Todo esto convierte a Axio en una herramienta útil dentro del ámbito de la accesibilidad
web y el diseño.
2. TECNOLOGÍAS EMPLEADAS
Las tecnologías seleccionadas responden a criterios de rendimiento, escalabilidad,
tiempo de desarrollo y compatibilidad con el despliegue en Raspberry Pi. 
11
2.1 Hardware necesario
El sistema ha sido diseñado para funcionar de manera eficiente en entornos de
bajo consumo y es totalmente agnóstico del hardware. Sin embargo, se ha
utilizado como dispositivo principal una Raspberry Pi de 8GB de RAM debido
a su arquitectura ARM64 optimizada, su bajo consumo energético y su capacidad
suficiente para ejecutar contenedores Docker. El almacenamiento se gestiona
mediante una tarjeta MicroSD destinada al sistema operativo y un volumen
persistente para la base de datos, en mi caso ha sido de 128GB.
La conexión red se realiza mediante Ethernet Gigabit para asegurar baja
latencia, especialmente necesaria para el correcto funcionamiento de las
comunicaciones en tiempo real mediante WebSockets.
• Docker y Docker Compose.
- Justificación: Garantiza que el entorno de desarrollo sea idéntico
al de producción. Elimina el problema de "en mi máquina
funciona", crucial al desplegar en una arquitectura diferente
(ARM) como la Raspberry Pi.
• Raspberry Pi 5.
- Justificación: Se busca demostrar la eficiencia del código. Si Axio
puede correr con fluidez en un hardware de bajo consumo y
recursos ilimitados, demuestra una optimización superior a si se
desplegara en un servidor cloud ilimitado.
2.2 Software necesario y Stack Tecnológico.
Axio usa herramientas de código abierto. Se priorizó un desarrollo rápido, buena
comunicación en tiempo real, interfaz reactiva y flexibilidad con los datos,
además de integrar IA.
2.2.1 Backend (Servidor).
• Node.js y TypeScript.
- Elección: Se optó por un entorno que permite manejar múltiples
conexiones concurrentes (WebSockets). TypeScript se añade para
proporcionar tipado estático.
- Justificación frente a Python/Django: Aunque Python es potente
para la IA, Node.js comparte el mismo lenguaje (JS/TS) que el
frontend, permitiendo reutilizar tipos e interfaces. Además,
Node.js tiene un rendimiento superior en Entrada/Salida para
aplicaciones en tiempo real.
12
• Express.
- Elección: Framework web minimalista y flexible.
- Justificación frente a NestJS: NestJS añade una capa de
complejidad excesiva para un MVP ágil. Express permite una
iteración más rápida y un control más directo sobre los
middlewares.
• Base de Datos. MongoDB (Mongoose).
- Elección: Base de datos NoSQL adecuada para datos flexibles y
anidados, como resultados de auditorías de IA.
- Justificación frente a SQL (MySQL / PostgreSQL): La
estructura de datos del proyecto es variable (un reporte puede tener
campos impredecibles o anidados). MongoDB permite almacenar
objetos JSON (Formato de las auditorías) sin necesidad de
migraciones de esquemas rígidas, agilizando el desarrollo.
• Seguridad (Bcryptjs y JWT).
- Justificación: JWT permite una autenticación sin estado, lo que
reduce la carga en el servidor y facilita la escalabilidad horizontal,
a diferencia de las sesiones tradicionales.
2.2.2 Frontend (Cliente).
La interfaz es una Single Page Application construida con React.
• React y Vite.
- Elección: Librería de UI basada en componentes y bundler de
última generación.
- Justificación frente a Angular: React ofrece una curva de
aprendizaje más adaptada al tiempo del proyecto y una mayor
flexibilidad. Vite se eligió sobre Create-React-App por ser
significativamente más rápido en el arranque del servidor de
desarrollo y en la compilación.
• Tailwind CSS.
- Elección: Permite un diseño completamente personalizado y
optimizado.
- Justificación frente a Bootstrap / MUI: Bootstrap impone un
diseño muy genérico difícil de personalizar. Tailwind permite
construir una interfaz totalmente personalizada sin salir del
HTML, reduciendo el tamaño final del CSS al quitar clases no
usadas.
• Servidor Web. Nginx.
13
- Elección: Servidor web ligero de alto rendimiento y arquitectura
dirigida por eventos.
- Justificación frente a Apache: Nginx consume
significativamente menos memoria bajo carga, lo cual es crítico en
un entorno limitado como la Raspberry Pi.
• Comunicación. Axios y Socket.io.
- Justificación (Socket.io vs WebSockets nativos): Socket.io
gestiona automáticamente las reconexiones y ofrece "salas", lo
cual simplifica bastante la lógica al aislar a los usuarios en
diferentes proyectos colaborativos.
2.2.3 Servicios especializados.
• IA: Google Gemini 2.5 Flash.
- Justificación frente a OpenAI (GPT-4 Vision): Gemini Flash
ofrece una ventana de contexto amplia y, crucialmente, es más
rápido y económico (gratuito en este caso) para el análisis de
imágenes, lo cual es vital para un proyecto académico.
• Scraping. Puppeteer.
- Elección: Control de Chrome Headless.
- Justificación frente a Cheerio: Cheerio solo analiza el HTML
estático. Las webs modernas (React/Vue) requieren ejecutar
JavaScript para renderizarse. Puppeteer permite capturar la web tal
cual la ve el usuario, incluyendo estilos y scripts.
• Túnel Cloudflare (cloudflared).
- Elección: Túnel inverso que expone servicios locales a Internet sin
abrir puertos del router.
- Justificación: Permite el acceso público a la Raspberry Pi desde
cualquier navegador sin necesidad de IP pública fija ni
configuración de DNS dinámico. Cloudflare proporciona
certificado SSL automático y protección DDoS básica de forma
gratuita. El servicio se despliega como un contenedor más dentro
de Docker Compose.
14
2.3 Patrón de arquitectura
Se ha implementado una arquitectura basada en servicios contenerizados con un
patrón de diseño MVC (Modelo-Vista-Controlador) en el Backend.
Figura 1: Diagrama del patrón MVC
• Nivel de infraestructura: Cada servicio es clave y se ejecuta en su propio
contenedor aislado, comunicándose a través de una red virtual interna de
Docker.
• Nivel de aplicación:
- Modelo: Definición de esquemas de datos con Mongoose.
- Controlador: Lógica de negocio que procesa las peticiones y
orquesta los servicios.
- Vista: La vista está desacoplada y servida por el Frontend a través
de una API REST, siguiendo una arquitectura SPA.
• Patrón de comunicación:
- Síncrono (HTTP/REST): Para operaciones CRUD estándar.
- Asíncrono: Para la colaboración en tiempo real mediante
WebSockets y las notificaciones mediante Webhooks a n8n.
Figura 2: Contenedores Docker
15
CAP. 3 DESARROLLO ESPECÍFICO DE LA
CONTRIBUCIÓN
A continuación, se explica el trabajo realizado: alcance, planificación, análisis,
diseño, implementación y fase de pruebas.
1. ALCANCE
El proyecto abarca el ciclo completo de desarrollo de software para crear una
plataforma colaborativa.
1.1Requisitos funcionales.
El alcance funcional implementado se divide en los siguientes módulos:
• Módulo de Gestión de Identidad: Sistema de registro y autenticación de
usuarios mediante credenciales encriptadas (bcryptjs) y gestión de
sesiones sin estado a través de JSON Web Tokens (JWT). Incluye la
gestión de perfiles de usuarios, cambio de contraseñas, restablecimiento
de contraseñas olvidada por correo electrónico, subida de avatar y
personalización de la interfaz.
• Módulo de Auditoría Multimodal: Capacidad del sistema para ingerir y
analizar tres tipos de datos diferentes.
- Navegación en tiempo real: Captura automática de sitios web
públicos mediante scraping (Puppeteer).
- Archivos Visuales: Procesamiento de imágenes (JPG, PNG) y
documentos PDF (diseños, mockups)
- Código Fuente: Análisis semántico de archivos de texto (HTML,
JS, TSX).
• Módulo de Inteligencia Artificial: Integración con el LLM Google
Gemini 2.5 Flash para actuar como motor de auditoría. El sistema no solo
valida sintaxis, sino que interpreta el contexto visual y semántico para
ofrecer puntuaciones de accesibilidad y sugerencias en formato JSON.
• Módulo de Visualización y Empatía: Desarrollo de un visor de
proyectos avanzado que incluye un motor de empatía. Este apartado
permite aplicar filtros SVG en tiempo real sobre la interfaz para simular
patologías visuales, permitiendo a los desarrolladores experimentar las
barreras de accesibilidad.
16
• Módulo de Colaboración Síncrona: Implementación de un sistema de
comunicación en tiempo real que permite a múltiples usuarios visualizar
el mismo proyecto, colocar marcadores posicionales sobre la interfaz y
chatear con una latencia de milisegundos.
• Módulo de Comunidad: Espacio público donde los usuarios pueden
exponer sus proyectos, recibir feedback mediante un sistema de votación
de estrellas y likes. Incluye filtros de exploración.
• Módulo de Mensajería Directa: Sistema de chat privado entre usuarios,
permitiendo la comunicación uno a uno con soporte para texto e imágenes.
Incluye notificaciones en tiempo real y marcado de mensajes como leídos.
• Módulo de Gamificación: Sistema de insignias que premia la actividad
de los usuarios (primer proyecto, proyectos constantes, análisis con IA,
calidad +80, participación en comunidad), visible en los perfiles públicos.
• Módulo de Administración: Panel de control para administradores que
permite la gestión de usuarios (suspensión, restablecimiento de
contraseñas), proyectos (ocultación, destacado), auditorías (exportación
CSV) y configuración global del sitio (modo mantenimiento, límite de
pines, tamaño máximo de subida).
1.2Requisitos no funcionales.
Además de las funcionalidades descritas el sistema se ha diseñado para cumplir
los siguientes requisitos no funcionales:
• Seguridad:
o Todas las contraseñas se almacenan hasheadas con bcryptjs.
o La autenticación se gestiona mediante JWT con expiración de 7
días.
o Se aplica rate limiting en endpoints sensibles.
o Los archivos subidos se validan por tipo MIME y extensión
(Multer).
o Cabeceras de seguridad configuradas con Helmet.
• Rendimiento:
o La comunicación en tiempo real debe mantener una latencia
inferior a 500ms entre el envío de un pin y su recepción por otros
usuarios en el mismo proyecto.
o Las capturas de pantalla mediante Puppeteer deben completarse en
menos de 10 segundos para URLs estándar.
17
• Usabilidad:
o Interfaz adaptable a dispositivos móviles, tabletas y escritorio.
o Tema oscuro y claro seleccionable por el usuario.
o Sistema de texto a voz integrado para mejorar la accesibilidad de
la propia plataforma.
o Feedback visual inmediato en interacciones.
• Mantenibilidad:
o Código tipado con TypeScript en frontend y backend, facilitando
la detección de errores y la refactorización.
o Separación clara de responsabilidades mediante el patrón MVC en
el backend y la organización por contextos.
1.3Funcionalidades no incluidas en esta versión.
Quedan fuera del alcance de la presente versión las siguientes funcionalidades,
que se contemplan como posibles trabajos futuros.
• Pasarelas de pago o modelo de suscripción.
• Aplicación móvil nativa.
• Análisis de contenido multimedia animado.
• Soporte multilingüe completo.
18
2. PLANIFICACIÓN
Para la gestión del proyecto se ha adoptado la metodología SCRUM, adaptada al
contexto de un único desarrollador. En este enfoque, la misma persona asume
todos los roles y organiza el trabajo en 6 Sprints, permitiendo planificar,
desarrollar y revisar avances de forma iterativa. Esta adaptación permite ir
sacando versiones funcionales del software poco a poco.
Aunque no hay un equipo con quien reunirse, realizo un breve seguimiento diario
respondiendo a tres preguntas: "¿Qué hice ayer?", "¿qué haré hoy?", "¿hay algún
impedimento?". Al final de cada Sprint se documenta como control interno.
Figura 3: Esquema de seguimiento
Sprint 1. Cimientos y seguridad.
1. Configuración del repositorio y entorno de desarrollo.
2. Levantamiento de infraestructura inicial con Docker (MongoDB),
inicialmente en el entorno local.
3. Implementación del servidor Express y el sistema de autenticación.
Sprint 2. El Cerebro.
1. Desarrollo de los controladores de análisis.
2. Integración del SDK de Google Generative AI.
3. Implementación del servicio de Web Scrapping con Puppeteer para
capturas de pantalla automatizadas.
4. Configuración de Multer para la gestión de subida de archivos.
19
Sprint 3. Interfaz del usuario.
1. Arquitectura del cliente en React + Vite.
2. Implementación de un AuthContext (carnet de identidad que le dice a la
web si el usuario está logueado y quién es) y protección de rutas.
3. Desarrollo del Dashboard principal y la vista de gestión de portafolio.
4. Conexión con la API REST mediante Axios Interceptors.
Sprint 4. Experiencia de Usuario.
1. Desarrollo de la vista detalla de proyecto.
2. Implementación de lógica de filtros visuales mediante matrices de color
SVG.
3. Adaptación del visor para soportar renderizado condicional según el tipo
de archivo (Iframe).
Sprint 5. Colaboración y Comunidad.
1. Configuración del servidor de WebSockets y gestión de salas por
proyecto.
2. Desarrollo del componente PinLayer para la colocación de anotaciones
con coordenadas relativas.
3. Implementación del módulo "Explorar" con lógica de votación, filtrado y
persistencia de interacciones sociales.
Sprint 6. Infraestructura y Despliegue.
1. Dockerización final de la aplicación.
2. Configuración de Nginx como servidor web.
3. Integración de n8n para automatización de notificaciones.
4. Despliegue y validación de entorno de producción en Raspberry Pi 5.
20
2.1 Planificación de tareas.
A continuación, se presenta un desglose de las actividades necesarias para el
proyecto.
2.1.1 Tareas de alto nivel.
• Análisis de Requisitos y Diseño de Arquitectura: Definición exhaustiva
del stack tecnológico, diagramado de componentes y modelado de la base
de datos.
• Configuración y Despliegue de Infraestructura: Preparación del entorno
de producción basado en contenedores en la Raspberry Pi.
• Desarrollo del Núcleo del Servidor (Backend): Implementación de la API
REST, lógica de negocio y servicios de IA.
• Desarrollo de la Experiencia de Usuario (Frontend): Construcción de la
interfaz interactiva, dashboard y herramientas de visualización.
• Integración de Servicios y APIs Externas: Conexión segura con
proveedores de IA y sistemas de almacenamiento de archivos.
• Fase de Pruebas y Optimización: Validación funcional y pruebas de carga.
2.1.2 Tareas de bajo nivel.
Infraestructura y DevOps.
• Instalación y configuración de seguridad (SSH, Firewall) en Raspberry
Pi OS.
• Redacción del archivo docker-compose.yml para gestionar los
contenedores de MongoDB.
• Configuración de volúmenes y redes internas de Docker para aislar los
servicios.
Backend (Node.js/Express).
• Implementación del middleware multer para la recepción, validación de
tipos de archivo y almacenamiento temporal de archivos.
• Desarrollo del servicio de conexión con la API de Google Gemini,
aplicando técnicas de Prompt Engineering para optimizar las respuestas
JSON.
21
• Diseño y creación de esquemas de datos en Mongoose para las
colecciones de Usuarios, Proyectos y Anotaciones.
Frontend (React/TypeScript).
• Configuración del entorno de desarrollo con Vite, TypeScript y Tailwind
CSS.
• Desarrollo del componente complejo Canvas capaz de renderizar
imágenes y capturar coordenadas relativas (X, Y) del ratón con
precisión.
• Implementación de la lógica de cliente para WebSockets (socket.ioclient) gestionando la recepción y pintado de pines en tiempo real.
• Programación de filtros CSS dinámicos para la simulación de patologías
visuales.
2.2Metodología de seguimiento.
Para la gestión de Axio se ha optado por una metodología SCRUM adaptada al
desarrollo individual, utilizando Trello como herramienta principal de
seguimiento.
El proyecto se ha fragmentado en hitos académicos y de desarrollo para asegurar
un buen control de las tareas y el cumplimiento de los plazos fijados.
2.2.1 Estructura de trabajo en Trello.
Se ha definido un tablero independiente por cada hito del proyecto. Cada tablero
utiliza un flujo de trabajo de cinco columnas para maximizar la visibilidad del
progreso:
• Backlog: Tareas identificadas pendientes de inicio.
• To Do: Tareas priorizadas para la iteración actual.
• En curso: Tareas activadas en desarrollo.
• Review: Fase de validación técnica y QA.
• Terminado: Tareas finalizadas que cumplen la definición de completado.
22
2.3Hitos del proyecto.
Los hitos del proyecto, vistos desde los entregables académicos y como
complemento a los Sprints ya descritos, fueron los siguientes:
• Hito 1: Anteproyecto.
Estado: Finalizado (Entrega: 05/12/2025).
En esta fase se definieron los objetivos del proyecto, el stack tecnológico y la
justificación legal basada en el Acta Europea de Accesibilidad 2025. Se elaboró
el documento inicial de anteproyecto con el alcance, la motivación y la
planificación preliminar.
Figura 4: Tabla Trello de Anteproyecto
• Hito 2: Análisis funcional.
Estado: Finalizado (Entrega: 12/12/2025).
Incluye el diseño del modelo de datos NoSQL con Mongoose, los diagramas de
arquitectura del sistema, la redacción de los casos de uso principales y el diseño
de la API REST con sus endpoints.
23
Figura 5: Tabla Trello de Análisis.
• Hito 3: Plan de pruebas.
Estado: Finalizado (Entrega: 19/12/2025).
Definición de la estrategia Shift-Left Testing y selección de herramientas
(Postman,
Selenium). Se elaboró el documento de plan de pruebas con los tipos de pruebas,
casos de prueba y ciclo de ejecución previsto.
Figura 6: Tabla Trello de Plan de pruebas
24
• Hito 4: Desarrollo.

Estado: Ejecutado (Sprints 1 a 6, finalizado en enero 2026).
Este hito segmenta el desarrollo técnico en módulos de Backend, Frontend e
Infraestructura, desglosando las historias de usuario en tareas atómicas dentro de
Trello. El detalle de cada Sprint se encuentra en la sección 2 de este capítulo.
Figura 7: Tabla Trello del Desarrollo
2.4 Tabla de planificación.
La tabla siguiente cruza los hitos académicos con los Sprints en desarrollo y sus
fechas de entrega:
Tabla 1: Cronograma de planificación
25
2.5 Definición del MVP.
Se ha definido un MVP centrado en las funcionalidades esenciales para garantizar
una defensa exitosa del proyecto. El objetivo es mitigar riesgos temporales
asegurando que el producto está completo con lo realmente necesario.
Características esenciales del MVP de Axio:
• Gestión de Identidad: Registro y login funcional con seguridad
mediante JWT y contraseñas hasheadas con bcryptjs. El sistema debe
permitir el registro de nuevos usuarios, el inicio de sesión, la protección
de rutas privadas y el cierre de sesión.
• Auditoría Core: Capacidad de procesar una imagen y obtener un análisis
de accesibilidad mediante IA Gemini. El sistema debe devolver una
puntuación numérica y un listado de problemas detectados con
sugerencias de mejora.
• Visor de Empatía: Implementación de filtros SVG de simulación visual
sobre la imagen del proyecto auditado. Debe incluir los filtros de
protanopía, deuteranopía, tritanopía, acromatopsía y desenfoque.
• Despliegue estable: Ejecución de la aplicación completa mediante
contenedores Docker entorno local de desarrollo, garantizando que el
proyecto pueda levantarse con un solo comando.
3. DESARROLLO DEL PROYECTO
3.1 Análisis.
3.1.1 Casos de uso principales.
Los casos de uso más representativos del sistema, que sirvieron de guía para el
diseño y la implementación, son los siguientes.
Caso de uso 1: Registro y autenticación de usuario.
• Actor: Usuario no registrado.
• Precondición: El usuario accede a la plataforma por primera vez.
• Flujo principal:
1. El usuario completa el formulario de registro (nombre de usuario, email,
contraseña).
2. El sistema valida el formato de los campos y la fortaleza de la contraseña.
3. El sistema verifica que el email y el nombre de usuario no estén ya en uso.
26
4. El sistema almacena el usuario con la contraseña hasheada.
5. El sistema emite un token JWT y redirige al dashboard.
• Postcondición: El usuario queda autenticado y puede acceder a las funciones
privadas de la plataforma.
Caso de uso 2: Auditoría de un sitio web mediante URL.
• Actor: Usuario registrado (Desarrollador).
• Precondición: El usuario ha iniciado sesión.
• Flujo principal:
1. El usuario introduce una URL en el formulario de nueva auditoría.
2. El backend lanza Puppeteer para navegar a la URL y capturar una captura de
pantalla completa.
3. La imagen capturada se envía a la API de Google Gemini 2.5 Flash para su
análisis multimodal.
4. Gemini devuelve un JSON con la puntuación de accesibilidad y una lista de
incidencias detectadas (elemento, problema, sugerencia, severidad).
5. El sistema crea un documento Project y un documento Audit vinculado en
MongoDB.
6. El frontend muestra el resultado en el visor de proyecto.
• Postcondición: El proyecto queda registrado con su auditoría y el usuario puede
visualizar los resultados, aplicar filtros sensoriales y compartirlo.
Caso de uso 3: Colaboración mediante pines en un proyecto.
• Actor: Usuario registrado (Revisor, Desarrollador).
• Precondición: Existe un proyecto con una imagen o captura renderizada.
• Flujo principal:
1. El usuario accede a la vista de proyecto (ProjectView).
2. El cliente se conecta a la sala WebSocket del proyecto.
3. El usuario hace clic en un punto de la imagen para colocar un pin.
4. El sistema captura las coordenadas relativas (X%, Y%) respecto al tamaño
del contenedor.
5. El usuario escribe el contenido del pin (comentario o sugerencia).
6. El pin se envía al servidor mediante WebSocket.
7. El servidor almacena el pin en MongoDB y lo retransmite a todos los
clientes conectados a la sala del proyecto.
8. El pin aparece en tiempo real en las pantallas de todos los usuarios que
visualizan el mismo proyecto.
• Postcondición: El pin queda registrado y visible para todos los colaboradores.
Caso de uso 4: Votación y valoración en la comunidad.
• Actor: Usuario registrado.
• Precondición: Existen proyectos publicados en la sección Comunidad.
• Flujo principal:
1. El usuario accede a la pestaña "Explorar" del dashboard.
27
2. El sistema muestra los proyectos públicos con opciones de filtrado
(recientes, populares, mejor puntuados).
3. El usuario puede dar "like" a un proyecto (toggle) o votar con una
puntuación de 1 a 5 estrellas.
4. El backend recalcula el averageRating del proyecto tras cada voto.
5. Las interacciones se reflejan en tiempo real para todos los usuarios.
• Postcondición: El proyecto refleja la valoración actualizada y el usuario ve
confirmada su interacción.
Caso de uso 5: Administración del sistema.
• Actor: Administrador.
• Precondición: El usuario tiene rol "admin".
• Flujo principal:
1. El administrador accede al panel de administración desde el dashboard.
2. Puede listar, buscar y filtrar usuarios, proyectos, auditorías y pines.
3. Puede suspender o reactivar usuarios.
4. Puede ocultar proyectos o pines que infrinjan las normas.
5. Puede exportar auditorías a formato CSV.
6. Puede modificar la configuración global del sitio (permitir registros, modo
mantenimiento, límites).
7. Todas las acciones quedan registradas en un activity log.
• Postcondición: Los cambios se aplican en el sistema y quedan registrados.
Caso de uso 6: Mensajería directa entre usuarios.
• Actor: Usuario registrado.
• Precondición: El usuario quiere comunicarse de forma privada con otro usuario.
• Flujo principal:
1. El usuario accede a la pestaña "Mensajes" del dashboard o al perfil del
destinatario.
2. El sistema busca si ya existe una conversación entre ambos (índice
compuesto en MongoDB sobre los dos participantes).
3. Si no existe, se crea una nueva conversación; si existe, se recuperan los
mensajes previos.
4. El usuario escribe un texto (máximo 2000 caracteres) y lo envía. El
mensaje se persiste en la colección Message vinculado a la conversación.
5. El servidor emite un evento new_dm a través de Socket.IO a la sala del
usuario destinatario (user:{id}).
6. El destinatario recibe una notificación en tiempo real y puede responder.
• Flujo alternativo: Si el usuario envía una imagen, Multer la procesa y la URL
se almacena en el campo image del mensaje en lugar del campo text.
• Postcondición: Ambos usuarios pueden continuar la conversación de forma
asíncrona. Los mensajes no leídos se marcan al entrar en la conversación.
28
Caso de uso 7: Subida de archivo para auditoría con IA.
• Actor: Usuario registrado (Desarrollador o Diseñador).
• Precondición: El usuario ha iniciado sesión y tiene un archivo que analizar.
• Flujo principal:
1. El usuario accede a la pestaña "Nueva Auditoría" del dashboard.
2. Selecciona la opción "Subir archivo" y arrastra o selecciona una imagen
(JPG, PNG) o un archivo de código (HTML, CSS, JS).
3. Multer valida el tipo MIME y la extensión del archivo (rechaza formatos
no permitidos) y verifica el tamaño máximo (10 MB).
4. El archivo se guarda temporalmente en /uploads del servidor.
5. Si es una imagen, se envía a Gemini 2.5 Flash para análisis visual de
accesibilidad (contraste, jerarquía, legibilidad).
6. Si es código fuente, se envía el contenido textual para análisis semántico
de buenas prácticas de accesibilidad (atributos alt, roles ARIA, etiquetas).
7. El modelo devuelve un JSON con score y array de issues que se persisten
como Audit vinculado a un nuevo Project.
• Postcondición: El proyecto aparece en "Mis Proyectos" con su auditoría lista
para revisar.
3.1.2 Modelo de datos.
El sistema utiliza MongoDB como base de datos NoSQL, con 9 colecciones
principales modeladas mediante Mongoose:
• User: Almacena los datos de los usuarios registrados (username, email,
password hasheado, avatar, biografía, rol, estado de suspensión).
• Project: Representa un proyecto auditado (título, propietario, tipo de
entrada, captura de imagen, puntuación de accesibilidad, likes,
valoraciones, estado de visibilidad).
• Audit: Contiene el resultado del análisis de IA vinculado a un proyecto
(puntuación numérica, array de incidencias con elemento, problema,
sugerencia y severidad, respuesta bruta del modelo).
• Pin: Anotación colaborativa sobre un proyecto (coordenadas X e Y en
porcentaje, contenido textual, autor, estado de visibilidad).
• Conversation: Conversación privada entre dos usuarios (array de dos
participantes, último mensaje, fecha de última actividad).
• Message: Mensaje individual dentro de una conversación (emisor,
receptor, texto o imagen, marca de lectura).
29
• Notification: Notificación push para un usuario (tipo: mensaje directo o
pin, título, cuerpo, datos adicionales, marca de lectura).
• Admin: Registro de permisos de administrador vinculado a un usuario
(permisos granulares por módulo, activity log, estado activo).
• SiteConfig: Configuración global del sitio como documento único
(permitir registros, modo mantenimiento, máximo de pines por proyecto,
tamaño máximo de subida de archivos).
Figura 8: Modelo lógico de Colecciones
30
Figura 9: Diagrama de relaciones entre colecciones
3.2 Diseño.
• Modelo de datos.
El diseño del modelo de datos sigue un enfoque documental (NoSQL) con
MongoDB, aprovechando la flexibilidad del formato JSON para almacenar
estructuras de datos variables como los reportes de auditoría generados por la IA.
Las relaciones entre colecciones se implementan mediante referencias por
ObjectId (normalización por referencia en lugar de documentos embebidos), lo
que facilita la actualización independiente de cada entidad y evita la duplicación
de datos. Por ejemplo, un documento Audit referencia a su Project mediante el
campo "project", y un Pin referencia tanto a su Project como a su Author (User).
Los arrays de referencias (como los likes en Project, que almacenan ObjectIds de
User) permiten consultas eficientes como "usuarios que han dado like a este
proyecto" sin necesidad de colecciones intermedias.
31
Para el modelo Conversation, se utiliza un índice compuesto sobre el array de
participants que permite encontrar rápidamente si ya existe una conversación
entre dos usuarios.
• Interfaz del usuario.
La interfaz de usuario se estructura como una Single Page Application (SPA) con
React Router para la navegación. Las páginas principales son:
o Home (/): Landing page pública con información del proyecto y
enlaces a registro y login.
o Login (/login) y Register (/register): Formularios de
autenticación.
o Dashboard (/dashboard): Punto central de la aplicación tras el
login. Organizado en pestañas: Nueva Auditoría, Mis Proyectos,
Comunidad, Mensajes, Configuración, Administración (solo
admin).
o ProjectView (/project/:id): Visor detallado de un proyecto con el
motor de empatía (filtros), capa de pines colaborativos y chat
lateral.
o Messages (/messages): Sistema de mensajería directa con lista de
conversaciones y chat.
o Profile (/u/:username): Perfil público de usuario con sus
proyectos, estadísticas e insignias.
o Admin (/admin): Panel de administración con gestión de usuarios,
proyectos, auditorías y configuración.
3.3 Implementación.
3.3.1 Backend.
El backend se ha implementado siguiendo el patrón MVC y se estructura en las
siguientes capas:
• Routes: Definen los endpoints REST de la API, agrupados por dominio
funcional. Cada archivo de rutas asocia un vero HTTP y una ruta con su
controlador correspondiente, aplicando middlewares de protección y de
subida de archivos.
• Controllers: Contienen la lógica de negocio. Cada controlador recibe la
petición HTTP, valida los datos de entrada, interactúa con los modelos de
Mongoose y devuelve una respuesta JSON con el código de estado HTTP
apropiado, por ejemplo:
32
o analyzeController.ts: analyzeImage para imágenes y PDFs, y
analyzeURL para URLs. Ambos métodos utilizan internamente
funciones helper que invocan el SDK de Google Generative AI.
• Models: Esquemas de Mongoose con validaciones, referencias entre
colecciones e índices para optimizar consultas frecuentes.
• Middlewares:
o auth.ts: Valida JWT, bloquea usuarios suspendidos, exige rol
"admin" y auto genera permisos faltantes.
o upload.ts: Gestiona subidas con Multer, limita el tamaño a 10MB
y filtra por tipo MIME/Extensión.
o rateLimit.ts: Limitador propio en memoria sin librerías externas
para entornos ARM.
• Services: webScrapper.ts encapsula la lógica de Puppeteer para la captura
de páginas web. La función scrapeUrl lanza un navegador Headless,
navega a la URL proporcionada, espera a que el evento load se complete
y toma una captura de pantalla completa en formato JPEG.
• Utils:
o jwt.ts: Centraliza la clave JWT_SECRET (con valor por defecto
para desarrollo) para que auth.ts y app.ts accedan a ella sin
duplicar lecturas de entorno.
o socket.ts: Implementa un singleton (getIo/setIo) de Socket.IO que
permite a los controladores HTTP emitir eventos (como new_dm)
sin pasar la instancia por parámetro.
o badges.ts: Lógica de gamificación que evalúa y asigna 5 insignias
(Primer Proyecto, Constante, Análisis Activo, Calidad +80,
Comunidad) analizando proyectos, uso de IA, accesibilidad y
likes.
o siteConfig.ts: Gestiona un documento único de configuración en
MongoDB como caché global; define parámetros dinámicos como
permitir registros (allowRegistration) o el límite de subida
(maxUploadMb).
• Socket.IO: El servidor WebSocket se inicializa junto con Express en
app.ts. Se gestionan dos tipos de salas: por usuario y por proyecto. 
33
3.3.2 Frontend.
El frontend se ha implementado como una SPA con las siguientes capas:
• Context API:
o AuthContext: Gestiona el estado de autenticación. El token
persiste en localStorage.
o SocketContext: Establece y mantiene la conexión WebSocket con
el servidor, proporcionando funciones para unirse a salas y enviar
eventos.
o ThemeContext: Controla el tema visual y persiste la preferencia
del usuario.
• Pages: De las doce páginas, diez tienen ruta propia en React Router,
mientras que dos se renderizan como pestañas internas del componente
Dashboard, gestionadas mediante el estado local con persistencia en
sessionStorage.
• Servicios:
o api.ts: Instancia de axios configurada con la URL base de la API
y un interceptor que inyecta automáticamente el token JWT en la
cabecera Authorization de cada petición. En caso de error 401,
redirige al login.
o adminService.ts: Funciones específicas para las operaciones del
panel de administración.
• Componentes especializados:
o A11yProvider.tsx: Implementa el sistema de texto a voz mediante
la Web Speech API.
o PinLayer.tsx: Componente de Canvas que renderiza la capa de
pines sobre la imagen del proyecto.
3.3.3. Patrones de implementación relevantes.
Hay varios patrones y soluciones técnicas que conviene detallar:
• Interceptor Axios (api.ts):
o Peticiones: Inyecta automáticamente el token JWT de
localStorage en la cabecera Authorization.
o Respuestas: Captura errores 401 (token expirado), limpia el
almacenamiento y redirige a /login.
o Instancia publica: Los endpoints abiertos (login/registro) usan
una instancia aislada sin interceptor.
34
• WebSockets (SocketContext)
o Transporte: Forzado a polling (HTTP long-polling) para
garantizar compatibilidad con capas gratuitas de Cloudflare
(cloudflared).
o Salas: Emite join_user al conectar para asociar al usuario a su
canal de notificaciones.
o Contingencia: Realiza un chequeo silencioso cada 3 segundos
como fallback para mensajes directos.
• Motor de empatía (ProjectView.tsx)
o Daltonismo: Usa filtros SVG feColorMatrix en tiempo real para
simular Protanopia, Deuteranopia y Tritanopia.
o Otros efectos: Aplica filtros CSS directos para Acromatopsia
(grayscale(100%)) y Baja vision (blur(4px)).
o Restricción: Se ejecuta exclusivamente sobre elementos visuales
(imágenes y URLs), nunca en código fuente.
• Pipeline de Análisis con IA (analyzeController.ts)
o Ingesta:
▪ Imágenes/PDFs: Envío directo del buffer a Gemini 2.5
Flash.
▪ Código: Lectura e inserción del contenido textual en el
prompt.
▪ URLs: Captura previa de pantalla con Puppeteer antes del
envío visual.
▪ Procesamiento: El prompt exige un formato JSON
estricto ({ score, issues }). Se eliminan marcas markdown
de la respuesta, se parsea el resultado y se guarda en la
colección Audit. Errores de formato devuelven un código
422.
• Flujo de Autenticación JWT
• Registro: Recibe credenciales -> Hashea password (bcrypt, salt 10) ->
Guarda en BD (select: false).
• Login: Valida estado activo -> Compara hash -> Firma JWT (valido por
7 días) -> Devuelve token y datos.
• Inyección: El frontend almacena el token y el interceptor lo adjunta en
cada petición HTTP.
• protect: Extrae y verifica el token (jwt.verify). Inyecta el usuario en
req.user y valida que no esté suspendido.
35
• requireAdmin: Confirma rol de administrador, genera o vincula sus
permisos granulares en la colección Admin y actualiza lastLogin.
• expiración: Al recibir un error 401, el cliente destruye la sesión local y
redirige a la interfaz de acceso.
• Prompts y Matrices de Configuracion
• Prompts (Gemini 2.5 Flash)
o análisis Visual: "Actua como un auditor experto en Accesibilidad
Web (WCAG 2.1) y Diseno UI/UX. Analiza esta interfaz
visualmente. Detecta problemas de contraste, tamano de texto y
distribucion. Responde SOLO con JSON valido: { score: 0-100,
issues: [{ element, problem, suggestion, severity }] }"
o Analisis de Codigo: "Actua como un auditor experto en
Accesibilidad Web (WCAG 2.1) y Codigo Limpio. Analiza este
archivo de codigo fuente: . Busca errores de: HTML semantico,
etiquetas ARIA faltantes, falta de alt en imagenes. [CODIGO: ]
Responde SOLO con JSON valido: { score: 0-100, issues: [{
element, problem, suggestion, severity }] }"
3.3.4 Despliegue en Raspberry Pi 5 con túnel Cloudflare.
Uno de los aspectos diferenciales del proyecto es que la plataforma no se despliega
en un servicio cloud de pago, sino en una Raspberry Pi 5 autoalojada que funciona
como servidor de producción 24 horas con un consumo eléctrico inferior a 15W.
La arquitectura de despliegue se compone de 7 contenedores Docker orquestados
mediante Docker Compose en una red virtual interna:
• MongoDB (base de datos NoSQL)
• Mongo Express (visor web de la base de datos)
• Redis (caché en memoria)
• Backend (Node.js + Express + TypeScript)
• Frontend (React compilado servido por Nginx como proxy inverso)
• n8n (automatización de notificaciones vía webhooks)
• Cloudflared (túnel de Cloudflare para acceso público)
El contenedor cloudflared establece una conexión cifrada saliente con la red de
Cloudflare, creando un túnel que expone el puerto 80 del contenedor Nginx a
Internet a través de un dominio propio o una URL temporal de trycloudflare.com.
Esto ofrece tres ventajas fundamentales: no requiere abrir puertos en el router
doméstico, no necesita IP pública fija ni DNS dinámico, y proporciona certificado
SSL automático.
El flujo completo de una petición desde Internet es: Usuario → Navegador →
Cloudflare Edge (SSL) → Túnel cloudflared → Nginx (frontend) → Backend
(API/WebSocket) → MongoDB. Nginx actúa como proxy inverso redirigiendo
las peticiones /api/ y /socket.io/ al backend, y sirviendo los archivos estáticos de
/uploads/ desde el volumen compartido.
3.4 Fase de pruebas y QA.
La calidad en Axio no se ha tratado como una fase separada al final, sino como
un proceso continuo durante todo el desarrollo para garantizar la fiabilidad de las
auditorías de IA y la estabilidad de la colaboración en tiempo real.
3.4.1 Estrategia de pruebas.
La estrategia de pruebas se ha centrado en tres objetivos: garantizar la integridad
de datos del usuario, validar la precisión de los reportes generados por IA y
asegurar una latencia mínima mediante WebSockets.
• Relación con la metodología SCRUM: Cada Sprint ha incluido una fase
de validación que ha exigido la superación de pruebas antes de considerar
una tarea como finalizada.
• Enfoque Shift-Left Testing: Se ha aplicado el testeo desde las etapas mas
tempranas del desarrollo. Esto ha incluido la validación de los prompts de
la IA mediante pruebas iterativas con diferentes tipos de entrada y la
verificación de componentes UI antes de conectarlos con la lógica del
backend.
36
3.4.2 Infraestructura de pruebas.
Para minimizar los riesgos, se han mantenido entornos separados durante el
desarrollo:
• Entorno de Desarrollo (Local): Ejecución del backend mediante tsx
watch en el equipo de desarrollo local (Windows), con el frontent servido
por Vite en modo desarrollo y las React DevTools para inspeccionar el
estado de los componentes.
• Entorno de Testing (Docker): Un clon del entorno de producción
levantado mediante Docker Compose en local, emulando la red interna y
los volúmenes que posteriormente se desplegarían en la Raspberry Pi.
3.4.3 Tipos de pruebas realizadas.
Los tipos de pruebas que se ejecutaron, con ejemplos concretos y los resultados
que dieron, fueron los siguientes:
Pruebas Unitarias: Validación de funciones aisladas ejecutadas mediante scripts
con tsx. Se han verificado casos como:
• Ejemplo 1: Función de hashing de contraseñas con bcryptjs. Se comprobó
que el hash generado para una misma contraseña nunca es idéntico (por el
salt aleatorio) pero que la función compare devuelve true para la
contraseña correcta y false para una incorrecta. Resultado: superado.
• Ejemplo 2: Cálculo de coordenadas relativas de los pines. Se verificó que,
al hacer clic en la posición (200, 150) dentro de un contenedor de 800x600
píxeles, las coordenadas almacenadas son (25%, 25%), garantizando que
los pines se reposicionan correctamente al cambiar el tamaño de la
ventana. Resultado: superado tras corregir un error de redondeo en la
división.
Pruebas Funcionales: Verificación de los flujos de usuario completos utilizando
Postman para la API REST. Ejemplos:
• Ejemplo 1: Flujo de auditoría por URL. Se introdujo una URL válida
(https://example.com), el backend ejecutó Puppeteer correctamente, la
captura se envió a Gemini y se obtuvo un JSON con puntuación y
sugerencias. Resultado: superado.
• Ejemplo 2: Usuario introduce una URL inválida (protocolo no soportado,
como "ftp://archivo.com"). El sistema detectó el error en la validación del 
37
controlador y devolvió un código 400 con el mensaje "URL no válida o
no accesible", sin llegar a ejecutar Puppeteer. Resultado: superado.
• Ejemplo 3: IA devuelve error de análisis. Se subió una imagen
completamente borrosa (ilegible). Gemini no pudo extraer información de
accesibilidad y devolvió un error. El controlador capturó la excepción y
devolvió un código 422 con el mensaje "No se pudo analizar la imagen
proporcionada", sin interrumpir el funcionamiento del servidor.
Resultado: superado.
• Ejemplo 4: Registro con contraseña débil. Se intentó crear un usuario con
contraseña "123". El sistema rechazó la petición con código 400 indicando
los criterios mínimos (8 caracteres, una mayúscula, una minúscula, un
número). Resultado: superado.
Pruebas de Integración: Comprobación de la sincronización entre servicios.
Ejemplos:
• Ejemplo 1: Un usuario coloca un pin en un proyecto. Se verificó que el
pin se almacena correctamente en MongoDB y que el evento new_pin se
emite a través de Socket.IO a todos los clientes conectados a la sala del
proyecto en menos de 500 ms. Resultado: superado en red local, con
latencia media de 120 ms.
• Ejemplo 2: Un usuario da like a un proyecto. Se verificó que el array de
likes en MongoDB se actualiza automaticamente (toggle) y que el
frontend refleja el cambio de estado de forma optimista, revirtiendo en
caso de error de red. Resultado: superado.
Pruebas Manuales: Pruebas de aceptación de usuario realizadas en diferentes
dispositivos y navegadores para verificar la responsividad y la usabilidad.
Ejemplos:
• Verificación del diseño responsive en 3 dispositivos: 1920x1080,
820x1180 y 390x844. Se comprobó que el dashboard se adapta
correctamente, la barra de navegación colapsa en menú hamburguesa y
los pines mantienen su posición relativa. Resultado: superado.
• Prueba del "Motor de Empatía": Se aplicaron los 5 filtros visuales
(protanopía, deuteranopía, tritanopía, acromatopsía, desenfoque) sobre
una captura de proyecto y se verificó visualmente que la simulación es
coherente con las matrices de color documentadas en la literatura
científica sobre daltonismo. Resultado: superado.
• Prueba de accesibilidad de la propia plataforma: Se activó el sistema
TTS y se navegó por las páginas principales verificando que los elementos 
38
con data-speech se leen en español al hacer hover/focus. Resultado:
superado, aunque se detectó que el volumen por defecto era demasiado
alto, por lo que se ajustó al 70%.
3.4.4 Herramientas utilizadas.
Se han empleado las siguientes herramientas para cubrir todos los ángulos de la
aplicación:
• Postman: Utilizado para el testeo de la API REST. Se creó una colección
con todas las rutas organizadas por dominio, incluyendo variables de
entorno para el token JWT y el ID de proyecto. Esto permitió validar los
códigos de respuesta HTTP, el formato JSON y los mensajes de error de
forma automatizada tras cada cambio en el backend.
• Selenium: Seleccionado para las pruebas End-to-End de flujos críticos.
Se eligió Selenium frente a otras alternativas por su soporte para múltiples
navegadores, lo cual era importante para verificar la compatibilidad del
"Motor de Empatía". Selenium permitió validar los filtros SVG en
diferentes navegadores.
• tsx: Empleado para la ejecución de scripts de verificación lógica de
servidor de forma independiente, sin necesidad de levantar el servidor
Express completo. Se utilizó en vez de Frameworks de testeo porque el
objetivo era validar rápidamente funciones aisladas durante el desarrollo,
sin la sobrecarga de configuración que implica un Framework.
3.4.5 Ciclo de ejecución y resultados.
El ciclo de pruebas ha sido iterativo. Tras la detección de cualquier error, se ha
procedido a su corrección y a una posterior prueba de regresión para asegurar que
la solución no afectase a otras funcionalidades existentes.
Tabla 2: Ciclo de pruebas 1
Tabla 3: Ciclo de pruebas 2
39
Resultados globales obtenidos:
• Total de casos de prueba ejecutados: 28 (3 de repetición).
• Casos superados: 26.
• Casos fallidos detectados y corregidos: 2.
o Error de redondeo en el cálculo de coordenadas relativas entre
pines.
o Diferencia de saturación en el filtro de tritanopía entre Chrome y
Firefox.
• Incidencias de usabilidad detectadas y corregidas: 1 (volumen por
defecto del TTS ajustado al 70%).
Las pruebas manuales confirmaron la correcta responsividad de la interfaz en
dispositivos móviles y la efectividad de los filtros de simulación sensorial.
CAP 4. CONCLUSIONES y TRABAJOS FUTUROS
1. CONCLUSIONES.
El desarrollo de Axio ha permitido cumplir con los objetivos planteados al inicio
del proyecto.
En primer lugar, se consolidó una aplicación web Full-Stack completamente
funcional para la gestión integral y colaborativa de proyectos digitales. El entorno
centraliza capacidades de auditoría de accesibilidad, simulación sensorial y
colaboración en tiempo real, cubriendo el ciclo completo desde la subida de un
archivo hasta su revisión final por parte de la comunidad.
Respecto a los objetivos específicos, el uso de TypeScript como lenguaje
transversal en el frontend y el backend garantizó la consistencia de tipos y redujo
drásticamente los errores en tiempo de ejecución. Asimismo, la arquitectura
basada en contenedores Docker se desplegó con éxito en una Raspberry Pi 5, lo
que valida la viabilidad del Edge Computing en aplicaciones web complejas bajo
entornos de hardware limitados.
La integración de la API de Google Gemini 2.5 Flash resolvió de manera eficiente
el análisis multimodal de accesibilidad, procesando imágenes, archivos PDF,
código fuente y capturas de pantalla para generar informes estructurados con
métricas precisas y sugerencias de corrección directas.
40
Por su parte, la comunicación en tiempo real mediante Socket.IO hizo posible la
colaboración síncrona a través de anotaciones posicionales (pines) y un chat
integrado.
Los filtros de simulación visual desarrollados en el frontend (protanopía,
deuteranopía, tritanopía, acromatopsía y desenfoque) dan forma al motor de
empatía de la plataforma, permitiendo a los diseñadores y programadores
experimentar directamente las barreras digitales a las que se enfrentan las
personas con diversidad funcional visual.
En conclusión, este proyecto demuestra la viabilidad técnica de unificar
inteligencia artificial multimodal, herramientas síncronas y simulación sensorial
en un único sistema de auditoría, ofreciendo una solución práctica que contribuye
activamente al desarrollo de un entorno web más inclusivo.
2. TRABAJOS FUTUROS.
Como continuidad al desarrollo de Axio, se plantean las siguientes líneas de
trabajo futuro:
• Integración de pasarela de pago y modelo SaaS: Diseñar un sistema de
suscripciones con planes gratuitos y premium para habilitar cuotas de uso
que limiten o amplíen la cantidad de proyectos, los análisis avanzados y
la exportación de informes.
• Compatibilidad con lectores de pantalla externos: Optimizar la
estructura del código HTML para mejorar la interacción con softwares de
asistencia como JAWS y NVDA, complementando el sistema TTS propio
con una experiencia de navegación adaptada.
• Soporte multiidioma: Traducir la interfaz de usuario y los reportes de
auditoría a idiomas como inglés o francés con el fin de internacionalizar
la plataforma.
• Expansión del motor de IA: Conectar otros modelos multimodales de
última generación (como GPT-4 Vision o Claude) para ofrecer análisis
comparativos y evaluar variaciones en la precisión de los resultados.
• Sugerencias automáticas de corrección: Desarrollar un módulo que
proponga directamente los fragmentos de código corregidos (por ejemplo,
inserción de atributos alt faltantes o modificaciones en el CSS para
corregir contrastes) en lugar de solo listar los fallos.
• Aplicación móvil: Desarrollar versiones para iOS y Android que
permitan realizar revisiones rápidas desde smartphones, aprovechando la 
41
cámara para capturar y analizar la accesibilidad de interfaces físicas o
cartelería.
• Pipeline de CI/CD: Configurar flujos de integración y despliegue
continuo mediante GitHub Actions para automatizar la ejecución de
pruebas y agilizar la subida de cambios directamente a la Raspberry Pi 5.
• Auditoría de archivos multimedia: Ampliar las capacidades de análisis
de la IA para procesar vídeos y animaciones, permitiendo evaluar criterios
WCAG específicos para contenido dinámico.
CAPITULO 5. REFERENCIAS
Normativa Legal y Estándares.
Parlamento Europeo y Consejo de la Unión Europea. (2019, 17 de abril).
Directiva (UE) 2019/882 del Parlamento Europeo y del Consejo, sobre los
requisitos de accesibilidad de los productos y servicios. Diario Oficial de la Unión
Europea. Recuperado el 28 de noviembre de 2025, de https://eurlex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32019L0882
W3C Web Accessibility Initiative (WAI). (2018). Web Content Accessibility
Guidelines (WCAG) 2.1. World Wide Web Consortium. Recuperado el 28 de
noviembre de 2025, de https://www.w3.org/TR/WCAG21/
Mozilla Developer Network. (s. f.). Accessibility. MDN Web Docs. Recuperado
el 28 de noviembre de 2025, de https://developer.mozilla.org/enUS/docs/Web/Accessibility
Metodologías y Conceptos.
Schwaber, K., & Sutherland, J. (2020, noviembre). La Guía de Scrum. Scrum.org.
Recuperado el 28 de noviembre de 2025, de
https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-GuideSpanish.pdf
Abstracta. (s. f.). Shift left testing: Turn quality into a growth engine. Abstracta.
Recuperado el 28 de noviembre de 2025, de
https://abstracta.us/blog/devops/shift-left-testing/
Tecnologías y Frameworks.
42
-Frontend.
Microsoft. (s. f.). Documentation. TypeScript. Recuperado el 28 de noviembre de
2025, de https://www.typescriptlang.org/docs/
Meta Platforms, Inc. (s. f.). React reference. React. Recuperado el 28 de
noviembre de 2025, de https://react.dev/reference/react
Tailwind Labs. (s. f.). Tailwind CSS documentation. Recuperado el 28 de
noviembre de 2025, de https://tailwindcss.com/docs
Socket.IO. (s. f.). Socket.IO documentation. Recuperado el 28 de noviembre de
2025, de https://socket.io/docs/v4/
Vite. (s. f.). Vite: Next generation frontend tooling. Recuperado el 28 de
noviembre de 2025, de https://vitejs.dev/
-Backend.
OpenJS Foundation. (s. f.). Node.js documentation. Node.js. Recuperado el 28 de
noviembre de 2025, de https://nodejs.org/en/docs/
Express. (s. f.). Express - Node.js web application framework. Recuperado el 28
de noviembre de 2025, de https://expressjs.com/
Google. (s. f.). Puppeteer: Headless Chrome Node.js API. Recuperado el 28 de
noviembre de 2025, de https://pptr.dev/
Google. (2024). Gemini API overview. Google AI for Developers. Recuperado el
28 de noviembre de 2025, de https://ai.google.dev/docs
-Infraestructura.
Docker Inc. (s. f.). Docker documentation. Recuperado el 28 de noviembre de
2025, de https://docs.docker.com/
MongoDB, Inc. (s. f.). MongoDB documentation. Recuperado el 28 de noviembre
de 2025, de https://www.mongodb.com/docs/
Raspberry Pi Ltd. (s. f.). Raspberry Pi documentation. Recuperado el 28 de
noviembre de 2025, de https://www.raspberrypi.com/documentation/
43
CAPITULO 6. ANEXOS
Anexo I: Código fuente
El código fuente completo del proyecto está disponible en el repositorio de
GitHub asociado a este trabajo. https://github.com/juanfeemv/axio-tfg
Anexo II: Archivo docker-compose.yml
Se adjunta el archivo de orquestación de contenedores utilizado para el despliegue
de la infraestructura en la Raspberry Pi 5. El archivo define 7 servicios
(MongoDB, Mongo Express, Redis, backend, frontend/Nginx, n8n y cloudflared
para el túnel Cloudflare). https://github.com/juanfeemv/axiotfg/blob/main/infra/docker/docker-compose.yml
Anexo III: Manual de usuario
-Manual de administrador.
El administrador puede hacer las mismas tareas que el cliente pero puede
controlar y ver las estadísticas de todo el contenido de la página.
Cuando entras con usuario administrador, en la barra lateral se añade una sección
llamada administrador. En esta puedes ver las estadísticas resumidas de la página
y las demás acciones.
Figura 10. Panel de Administración: Resumen
44
Hay un CRUD de usuarios para poder bloquearlos, eliminarlos, crearlos,
editarlos.
Figura 11. Panel de Administración: Usuarios
Hay una tabla de proyectos para verlos, destacarlos, editar su categoría, ocultar el
proyecto y eliminarlo.
45
Figura 12. Panel de Administración: Proyectos
Puedes ver las auditorías hechas y eliminarlas.
Figura 13. Panel de Administración: Auditorías
Se pueden ver los comentarios y pines hechos en los proyectos y ocultarlos o
eliminarlos.
46
Figura 14. Panel de Administración: Pines
En la sección de actividad se pueden ver toda la actividad de los proyectos hechos.
Figura 15. Panel de Administración: Actividad.
En la sección de configuración hay varias opciones para la página web.
47
Figura 16. Panel de Administración: Configuración.
-Manual del cliente.
El cliente puede subir un proyecto sin auditar o analizarlo con IA, tiene tres
opciones: Web en Vivo, Diseño Visual o Código Fuente. Puede activar TTS para
pasar el texto a voz, y tiene un apartado de notificaciones en la esquina superior
derecha.
Figura 17. Dashboard
Puede navegar mediante la barra lateral izquierda y ver sus proyectos con sus
estadísticas.
48
Figura 18: Mis Proyectos
Si entra al apartado de comunidad, puede ver todos los proyectos hechos por los
usuarios y filtrar para ver los que tiene más likes, mejor valorados, los más
recientes y los que tienen mejor puntuación por la IA.
Figura 19: Comunidad
Puede entrar a un proyecto para ver la IA SCORE y la auditoría de la IA también
puede poner los filtros SVG. Para poder entrar en el perfil de alguien pulsa en el
nombre de usuario.
49
Figura 20: Vista del Proyecto
Al entrar en el perfil de usuario puede ver sus proyectos, sus estadísticas y las
insignias que ha ganado.
Figura 21: Perfil de Usuario: Proyectos
50
Figura 22: Perfil de Usuario: Estadísticas
Figura 23: Perfil de Usuario: Insignias.
51
Al entrar al apartado de mensajes puede ver sus recientes mensajes con los
usuarios, puede mandar emojis, imágenes y mensajes.
Figura 24: Mensajes
En su configuración puede subir una foto de perfil nueva, cambiar su nombre de
usuario, poner una descripción para que la vean los que se metan a su perfil,
cambiar de contraseña, poner el modo oscuro y eliminar la cuenta.
Figura 25: Configuración: Edición de Perfil
52
Figura 26: Configuración: Edición de contraseña / Apariencia / Eliminación de cuenta.
Anexo V: Endpoints de la API REST
A continuación, se listan todos los endpoints implementados en las 9 rutas del
backend. Todas las rutas salvo las indicadas requieren el token JWT en la
cabecera Authorization: Bearer .
Rutas de Autenticación (/api/auth)
POST /api/auth/register - Registro (rate limit: 10/15min)
POST /api/auth/login - Login (rate limit: 10/15min)
POST /api/auth/forgot-password - Solicitar reset de contraseña (rate limit:
5/15min)
POST /api/auth/reset-password/:token - Restablecer contraseña con token
PUT /api/auth/profile - Actualizar perfil (username, bio) [JWT]
PUT /api/auth/password - Cambiar contraseña [JWT]
DELETE /api/auth/me - Eliminar cuenta [JWT]
POST /api/auth/avatar - Subir avatar (multipart) [JWT]
Tabla 4. Rutas de Auteticación
Rutas de Análisis (/api/analyze)
POST /api/analyze - Analizar archivo (imagen/PDF/código) [JWT +
Multer]
POST /api/analyze/url - Analizar URL [JWT]
Tabla 5: Rutas de Análisis
53
Rutas de Proyectos (/api/projects)
GET /api/projects - Mis proyectos [JWT]
GET /api/projects/community - Proyectos públicos de la comunidad [JWT]
GET /api/projects/:id - Ver proyecto individual [JWT]
POST /api/projects - Crear proyecto (con/sin archivo) [JWT + Multer]
DELETE /api/projects/:id - Eliminar proyecto (solo propietario) [JWT]
PUT /api/projects/:id/like - Alternar like [JWT]
PUT /api/projects/:id/rate - Votar 1-5 estrellas [JWT]
Tabla 6: Rutas de Proyectos
Rutas de Pines (/api/pins)
GET /api/pins/:projectId - Pines de un proyecto [JWT]
POST /api/pins - Crear pin (x, y, contenido) [JWT]
DELETE /api/pins/:pinId - Eliminar pin (autor o propietario) [JWT]
Tabla 7: Rutas de Pines
Rutas de Usuarios (/api/users)
GET /api/users/:username - Perfil público por username
GET /api/users/id/:id - Perfil público por ID
Tabla 8: Rutas de Usuarios
Rutas de Mensajes (/api/messages)
GET /api/messages/conversations - Listar conversaciones [JWT]
POST /api/messages/conversations - Obtener o crear conversación [JWT]
GET /api/messages/:conversationId - Mensajes de una conversación [JWT]
POST /api/messages/:conversationId - Enviar mensaje (texto/imagen) [JWT +
Multer]
POST /api/messages/:conversationId/read - Marcar conversación como leída [JWT]
DELETE /api/messages/:conversationId - Eliminar conversación [JWT]
Tabla 9: Rutas de Mensajes
Rutas de Notificaciones (/api/notifications)
GET /api/notifications - Listar notificaciones (top 100) [JWT]
POST /api/notifications/read-all - Marcar todas como leídas [JWT]
POST /api/notifications/:id/read - Marcar una notificación como leída [JWT]
Tabla 10: Rutas de Notificaciones
Rutas de Estadísticas (/api/stats)
GET /api/stats/weekly - Estadísticas semanales (pública)
Tabla 11: Rutas de Estadísticas
54
Rutas de Administración (/api/admin)
(Todas requieren JWT + rol admin)
GET /api/admin/users - Listar usuarios
GET /api/admin/users/:id - Ver usuario
POST /api/admin/users - Crear usuario
PUT /api/admin/users/:id - Editar usuario
PUT /api/admin/users/:id/suspend - Suspender usuario
PUT /api/admin/users/:id/unsuspend - Reactivar usuario
POST /api/admin/users/:id/reset-password - Restablecer contraseña de usuario
DELETE /api/admin/users/:id - Eliminar usuario
GET /api/admin/projects - Listar proyectos
GET /api/admin/projects/:id - Ver proyecto
PUT /api/admin/projects/:id - Editar proyecto
DELETE /api/admin/projects/:id - Eliminar proyecto
GET /api/admin/audits - Listar auditorías
GET /api/admin/audits/export - Exportar auditorías a CSV
DELETE /api/admin/audits/:id - Eliminar auditoría
GET /api/admin/pins - Listar pines
PUT /api/admin/pins/:id/visibility - Cambiar visibilidad del pin
DELETE /api/admin/pins/:id - Eliminar pin
GET /api/admin/stats - Estadísticas globales de administración
GET /api/admin/activity - Registro de actividad (Activity log)
GET /api/admin/config - Ver configuración global del sistema
PUT /api/admin/config - Editar configuración global del sistema
Tabla 12: Rutas de Administración
Total: 54 endpoints
Anexo VI: Árbol de directorios del proyecto
server/src/
app.ts - Punto de entrada (Express + Socket.IO + MongoDB)
seed.ts - Utilidad de diagnóstico de la base de datos
controllers/
adminController.ts - CRUD de administración (usuarios, proyectos,
auditorías, pines, configuración)
analyzeController.ts - Análisis con IA (Gemini) + webhooks n8n
55
authController.ts - Gestión de registro, login, perfil, contraseña y avatar
messageController.ts - Mensajería directa (DMs)
notificationController.ts - Notificaciones en tiempo real
pinController.ts - Gestión de pines colaborativos + webhooks n8n
projectController.ts - CRUD de proyectos, likes y votaciones
statsController.ts - Generación de estadísticas semanales
userController.ts - Gestión de perfil público e insignias
middlewares/
auth.ts - protect (JWT), requireAdmin y requirePermission
upload.ts - Configuración de Multer (filtros MIME y límite de 10MB)
rateLimit.ts - Limitador de tasa en memoria (Map)
models/
Admin.ts - Permisos de administración y registro de actividad
Audit.ts - Resultados de auditoría IA (puntuación y problemas)
Conversation.ts - Modelo de conversación entre dos usuarios
Message.ts - Mensaje individual (texto o imagen)
Notification.ts - Modelo de notificación interna
Pin.ts - Anotación posicional (x, y, contenido)
Project.ts - Modelo de proyecto (título, tipo, likes y calificaciones)
SiteConfig.ts - Configuración global del sistema (patrón singleton)
User.ts - Modelo de usuario (username, email, contraseña, rol y
estado)
routes/
adminRoutes.ts - Enrutador para /api/admin/*
56
analyzeRoutes.ts - Enrutador para /api/analyze/*
authRoutes.ts - Enrutador para /api/auth/*
messageRoutes.ts - Enrutador para /api/messages/*
notificationRoutes.ts - Enrutador para /api/notifications/*
pinRoutes.ts - Enrutador para /api/pins/*
projectRoutes.ts - Enrutador para /api/projects/*
statsRoutes.ts - Enrutador para /api/stats/*
userRoutes.ts - Enrutador para /api/users/*
scripts/
createFirstAdmin.ts - Script para asignar rol de administrador a un usuario
migrateAdmins.ts - Migración de administradores a la colección Admin
services/
webScraper.ts - Instancia de Puppeteer (captura de URLs y autodetección
ARM)
utils/
badges.ts - Lógica de asignación de insignias (gamificación)
jwt.ts - Gestión de la clave JWT_SECRET del entorno
siteConfig.ts - Utilidad para obtener o crear la configuración global
socket.ts - Singleton para la instancia de Socket.IO
client/src/
main.tsx - Punto de entrada de React
App.tsx - Enrutador general y protección de rutas
index.css - Configuración de Tailwind CSS y estilos base
57
assets/
badges/ - Recursos gráficos para las 5 insignias del sistema
logo.png
components/
accessibility/A11yProvider.tsx - Lógica de texto a voz (Web Speech API)
collaboration/PinLayer.tsx - Lienzo interactivo para la gestión de pines
context/
AuthContext.tsx - Estado de autenticación global del cliente
SocketContext.tsx - Conexión y eventos globales de Socket.IO
ThemeContext.tsx - Gestión del tema claro y oscuro
pages/
Admin.tsx - Panel de control de administración
Dashboard.tsx - Vista principal estructurada en pestañas
Explore.tsx - Galería pública y exploración de proyectos
ForgotPassword.tsx - Formulario de solicitud de restablecimiento de
contraseña
Home.tsx - Página de inicio del sitio (Landing page)
Login.tsx - Formulario de inicio de sesión
Messages.tsx - Interfaz de chat y mensajes directos
MyProjects.tsx - Panel de gestión de proyectos propios
Profile.tsx - Visualización del perfil público de usuario
ProjectView.tsx - Visor detallado de proyecto con filtros y pines
Register.tsx - Formulario de registro de nuevos usuarios
ResetPassword.tsx - Formulario de actualización de contraseña mediante
token
58
Settings.tsx - Configuración general de la cuenta
services/
adminService.ts - Conexión con los servicios del panel de administración
api.ts - Instancia central de Axios con interceptor JWT
types/
assets.d.ts - Declaración de tipos para la importación de recursos
estáticos