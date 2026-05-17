AXIO
Plataforma colaborativa de auditoría y mejora de calidad para proyectos digitales.
CONVOCATORIA: Junio 2025
ALUMNO/A: Juan Felipe Mena Vega
TUTOR/A: Silvia Orenes Quiñones
CICLO: Desarrollo de aplicaciones web

ÍNDICE

CAPÍTULO 1. INTRODUCCIÓN
1. ABSTRACT .............................................................................................................................. 4
2. INTRODUCCIÓN ..................................................................................................................... 4
   2.1 Justificación ................................................................................................................ 4
   2.2 Planteamiento del problema / Contexto ................................................................... 5
   2.3 Objetivos del trabajo ................................................................................................. 5
       2.3.1 Objetivos Generales ........................................................................................ 5
       2.3.2 Objetivos Específicos ...................................................................................... 5
3. MOTIVACIÓN ........................................................................................................................... 6
   3.1 Marco teórico del trabajo ........................................................................................... 6
4. METODOLOGÍAS EMPLEADAS ............................................................................................ 7
   4.1 Metodología de desarrollo ......................................................................................... 7

CAPÍTULO 2. MARCO TEÓRICO O ESTADO DE LA CUESTIÓN
1. ANÁLISIS DEL CONTEXTO ................................................................................................... 9
2. TECNOLOGÍAS EMPLEADAS .............................................................................................. 12
   2.1 Hardware necesario ................................................................................................. 12
   2.2 Software necesario y Stack Tecnológico ................................................................ 13
       2.2.1 Backend (Servidor) ........................................................................................ 13
       2.2.2 Frontend (Cliente) ......................................................................................... 15
       2.2.3 Servicios especializados ............................................................................... 16
   2.3 Patrón de arquitectura ............................................................................................. 17

CAPÍTULO 3. DESARROLLO ESPECÍFICO DE LA CONTRIBUCIÓN
1. ALCANCE ............................................................................................................................... 19
2. PLANIFICACIÓN .................................................................................................................... 23
   2.1 Planificación de tareas ........................................................................................... 23
   2.2 Metodología de seguimiento .................................................................................. 24
   2.3 Hitos del proyecto ................................................................................................... 25
   2.4 Tabla de planificación ............................................................................................. 26
   2.5 Definición del MVP ................................................................................................. 26
3. DESARROLLO DEL PROYECTO .......................................................................................... 27
   3.1 ANÁLISIS ................................................................................................................... 27
      3.1.1 Casos de uso principales .............................................................................. 27
      3.1.2 Modelo de datos (visión general) ................................................................. 29
   3.2 DISEÑO ...................................................................................................................... 30
      3.2.1 Diseño del modelo de datos .......................................................................... 30
      3.2.2 Diseño de la interfaz de usuario ................................................................... 30
      3.2.3 Decisiones de diseño visual .......................................................................... 31
      3.2.4 Diseño responsive .......................................................................................... 31
      3.2.5 Componentes clave del Dashboard ............................................................... 31
      3.2.6 Accesibilidad de la propia plataforma ......................................................... 31
   3.3 IMPLEMENTACIÓN .................................................................................................. 32
      3.3.1 Backend (Node.js + Express + TypeScript) ................................................. 32
      3.3.2 Frontend (React + Vite + TypeScript) ......................................................... 34
      3.3.3 Patrones de implementación relevantes ....................................................... 35
   3.4 Fase de pruebas y QA ............................................................................................. 37

CAPÍTULO 4. CONCLUSIONES Y TRABAJOS FUTUROS ................................................... 39
CAPÍTULO 5. REFERENCIAS BIBLIOGRÁFICAS ................................................................ 34
CAPÍTULO 6. ANEXOS .............................................................................................................. 36
  Anexo I: Diagramas del sistema ................................................................................... 36
  Anexo II: Código fuente ................................................................................................ 36
  Anexo III: Archivo docker-compose.yml ...................................................................... 36
  Anexo IV: Manual de usuario ........................................................................................ 37
  Anexo V: Endpoints de la API REST ............................................................................ 37
  Anexo VI: Árbol de directorios del proyecto ................................................................ 38

ÍNDICE DE FIGURAS

Figura 1. Diagrama 1: Arquitectura de contenedores Docker ............................. 17
Figura 2. Diagrama 2: Patrón MVC en el backend ................................................ 17
Figura 3. Diagrama 3: Flujo de comunicación WebSocket .................................... 17
Figura 4. Imagen: Tablero de Trello .......................................................................... 24
Figura 5. Imagen: Documento de anteproyecto ....................................................... 25
Figura 6. Imagen: Diagrama de arquitectura (análisis funcional) ......................... 25
Figura 7. Imagen: Documento de plan de pruebas .................................................. 25
Figura 8. Imagen: Tablero Trello del hito de desarrollo ......................................... 25
Figura 9. Imagen: Tabla de planificación ................................................................. 26
Figura 10. Diagrama 4: Diagrama de casos de uso ................................................. 27
Figura 11. Diagrama 5: Diagrama Entidad-Relación .............................................. 29
Figura 12. Diagrama 6: Esquema detallado del modelo User ................................ 29
Figura 13. Diagrama 7: Esquema detallado del modelo Audit .............................. 29
Figura 14. Diagrama 8: Mapa de navegación de la SPA ........................................ 30
Figura 15. Imagen: Tabla del plan de pruebas funcionales .................................... 35

ÍNDICE DE TABLAS

Tabla 1. Tabla de planificación del proyecto ........................................................... 26
Tabla 2. Tabla del plan de pruebas funcionales y ciclo de ejecución ................... 35


CAPÍTULO 1. INTRODUCCIÓN

1. ABSTRACT
Axio es una plataforma web colaborativa diseñada para auditar, revisar y mejorar
productos digitales (webs, diseños o documentos). A diferencia de los validadores
tradicionales utiliza IA generativa multimodal para analizar no solo la sintaxis del
código, sino también el contexto semántico y la accesibilidad.
Incluye simulaciones sensoriales para ayudar a los desarrolladores a detectar barreras
para personas con discapacidades visuales. Se centra en la calidad visual y la
experiencia del usuario.

El desarrollo del proyecto ha permitido comprobar que es viable integrar
análisis de accesibilidad con IA, colaboración en tiempo real mediante anotaciones
visuales y simulación de patologías oculares en una única plataforma, ofreciendo una
herramienta que cubre desde la fase de diseño hasta la validación final del producto.

2. INTRODUCCIÓN
Con este trabajo se ha buscado diseñar y desarrollar una plataforma web que
permita auditar y mejorar la accesibilidad de productos digitales de forma colaborativa.
Para ello se han integrado herramientas de inteligencia artificial capaces de analizar
tanto código fuente como interfaces visuales, junto con simulaciones sensoriales que
ayudan a identificar barreras para personas con discapacidad visual. La plataforma se
ha diseñado buscando facilitar el trabajo conjunto entre desarrolladores y diseñadores
en todas las fases del ciclo de vida del producto.

2.1 Justificación
Este proyecto responde a dos necesidades. Por un lado, la urgente necesidad
de adaptación ante la entrada en vigor del Acta Europea de Accesibilidad en 2025,
exigiendo el cumplimiento de los estándares WCAG 2.1 (Web Content Accessibility
Guidelines). Por otro lado, atiende a una demanda social creciente: la necesidad de
espacios digitales donde la creatividad no sea un proceso solitario, sino una experiencia
compartida y enriquecida por la comunidad.

Axio justifica su existencia transformando la revisión de proyectos en un flujo de
trabajo visual, proactivo y colaborativo. Al permitir la interacción sobre bocetos o ideas
en fases tempranas, contribuye a asegurar la accesibilidad y facilita el intercambio de
conocimiento técnico y la revisión entre pares, ayudando a que los proyectos mejoren
desde sus primeras etapas.

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
• Implementar una arquitectura basada en contenedores con Docker sobre
una Raspberry Pi 5, demostrando competencias en administración de
sistemas y despliegue.
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
que sirva no solo como herramienta de validación, sino como un espacio de colaboración
innovación donde desarrolladores, diseñadores y creadores pueden ayudarse
mutuamente a construir un internet más inclusivo y mejor diseñado.

3.1 Marco teórico del trabajo
Para fundamentar el desarrollo de Axio, se presentan a continuación los conceptos
teóricos y normativos que sustentan la solución propuesta:

A) Fundamentos de la Accesibilidad y Calidad Digital.
• Accesibilidad Web: Cualidad que garantiza el acceso universal a contenidos
digitales independientemente de las capacidades cognitivas o físicas del
usuario. Se rige por estándares internacionales como las WCAG 2.1, que
establecen criterios de contraste, navegabilidad y compatibilidad con
tecnologías asistivas.
• Metodología Shift-Left Testing: Estrategia de calidad que propone el
desplazamiento de las pruebas a las etapas iniciales del ciclo de vida del
desarrollo. En el contexto de este proyecto, se aplica mediante la validación
de prototipos visuales y bocetos antes de la fase de codificación,
permitiendo detectar errores de contraste y jerarquía visual de forma
temprana.

B) Fundamentos Técnicos.
Arquitectura de Software (Stack Tecnológico).
• Full-Stack TypeScript: Utilización de un lenguaje unificado y fuertemente
tipado en todas las capas de la aplicación para garantizar la consistencia de
tipos y reducir errores en tiempo de ejecución.
• Contenerización: Despliegue modular de servicios (base de datos, caché,
servidor de aplicaciones) mediante Docker, asegurando la portabilidad y
el aislamiento de procesos.
• Inteligencia Artificial Generativa Multimodal (LLM): Integración de
modelos transformadores (Google Gemini) capaces de procesar texto e
imágenes simultáneamente, lo que permite la interpretación contextual
de interfaces gráficas para evaluar su accesibilidad.
• Comunicación en Tiempo Real: Establecimiento de canales
bidireccionales persistentes (Full-Duplex) mediante el protocolo
WebSocket para la sincronización de estado entre múltiples clientes.

C) Contexto Científico y Normativo.
• La Directiva (UE) 2019/882 (Acta Europea de Accesibilidad) establece
requisitos de accesibilidad obligatorios para productos y servicios a partir
de junio de 2025, generando una necesidad de herramientas de auditoría
accesibles y eficientes en el mercado.
• Edge Computing: Paradigma de procesamiento de datos realizado cerca
de la fuente de origen en lugar de en una nube centralizada. En este
proyecto se aplica desplegando de la infraestructura en
una Raspberry Pi 5 local, manteniendo el control sobre los datos y reduciendo
la latencia en operaciones críticas.

4. METODOLOGÍAS EMPLEADAS
El proyecto se ha organizado siguiendo una metodología ágil e iterativa.

4.1 Metodología de desarrollo
Se ha empleado la metodología SCRUM, adaptada al desarrollo individual. El ciclo
de vida se ha estructurado en "Sprints" de dos semanas de duración. Al finalizar cada
Sprint, se ha obtenido un incremento funcional del software.

Para el control de versiones, la integración continua y la gestión de tareas, se ha
utilizado GitHub.


CAPÍTULO 2. MARCO TEÓRICO O ESTADO DE LA CUESTIÓN

1. ANÁLISIS DEL CONTEXTO

1.1 Contexto del proyecto
El proyecto responde a la necesidad de validar la accesibilidad web de forma temprana
y objetiva, cumpliendo con la normativa europea de 2025. Actualmente, los
profesionales disponen de herramientas aisladas, pero no existe una plataforma
unificada que combine análisis multimodal, simulación visual, colaboración en tiempo
real y publicación social.

1.2 Actores principales y sus necesidades
La plataforma Axio está dirigida a los siguientes perfiles de usuario, cada uno con
necesidades específicas que el sistema debe cubrir:

• Desarrolladores web: Profesionales que necesitan validar la accesibilidad de
sus proyectos de forma rápida y obtener sugerencias concretas de mejora.
Requieren una herramienta capaz de analizar tanto el código fuente (HTML,
CSS, JavaScript) como el resultado visual renderizado, y que se integre en su
flujo de trabajo sin fricciones.

• Diseñadores UI/UX: Creadores de interfaces que trabajan con mockups,
bocetos y prototipos visuales. Necesitan poder subir imágenes o PDFs de sus
diseños para verificar contraste, jerarquía visual y legibilidad antes de
entregarlos al equipo de desarrollo, aplicando la filosofía shift-left.

• Revisores y consultores de accesibilidad: Perfiles especializados en auditar el
cumplimiento normativo. Necesitan poder señalar incidencias concretas sobre
la interfaz mediante anotaciones posicionales (pines) y compartir sus hallazgos
con el equipo de forma colaborativa.

• Usuarios finales con discapacidad visual: Personas que experimentan
barreras de accesibilidad en su día a día. La plataforma les ofrece filtros de
simulación sensorial que permiten a los creadores empatizar con sus
dificultades (daltonismo, baja visión) y, además, les permite participar como
revisores aportando feedback directo sobre los proyectos publicados.

• Estudiantes y creadores independientes: Usuarios que están aprendiendo
sobre desarrollo web y accesibilidad. La plataforma les proporciona un espacio
donde compartir sus proyectos, recibir retroalimentación de la comunidad y
aprender de las auditorías realizadas por otros.

1.3 Soluciones existentes y comparativa
Entre las soluciones existentes en el mercado destacan:

• Lighthouse / WAVE: Herramientas de auditoría de accesibilidad que analizan
el DOM de páginas web. Son eficaces para detectar errores de sintaxis y
etiquetado, pero no permiten simulación empática de patologías visuales,
colaboración en tiempo real ni análisis de imágenes estáticas o PDFs.

• Figma / Adobe XD: Entornos de diseño que ofrecen filtros de daltonismo y
comprobación de contraste integrados en el flujo de diseño. Sin embargo, no
incorporan análisis mediante inteligencia artificial ni permiten auditar código
fuente o URLs renderizadas.

• Herramientas de scraping tradicionales (Cheerio, BeautifulSoup): Analizan
HTML estático, pero no son capaces de renderizar webs modernas basadas en
JavaScript (React, Vue, Angular), lo que limita su utilidad en el ecosistema
actual.

• Plataformas de comunidad (Dribbble, Behance): Permiten compartir
proyectos visuales y recibir comentarios, pero carecen de herramientas de
validación técnica de accesibilidad y no ofrecen anotaciones posicionales sobre
la interfaz.

1.4 Carácter diferenciador de Axio
Lo que diferencia a Axio de otras herramientas es:

• Análisis de accesibilidad multimodal mediante IA, capaz de procesar
imágenes, PDFs, código fuente y páginas web renderizadas en un único flujo.
• Motor de empatía con filtros en tiempo real para la simulación de patologías
visuales (protanopía, deuteranopía, tritanopía, acromatopsía y visión borrosa).
• Colaboración síncrona mediante WebSockets, permitiendo la interacción
directa entre usuarios con anotaciones posicionales (pines) y chat integrado.
• Enfoque unificado: carga de archivos, scraping web, análisis con IA,
simulación sensorial y publicación comunitaria en un solo entorno.

Todo esto convierte a Axio en una herramienta útil dentro del ámbito de la accesibilidad web y el diseño colaborativo.


2. TECNOLOGÍAS EMPLEADAS
Las tecnologías seleccionadas responden a criterios de rendimiento, escalabilidad,
tiempo de desarrollo y compatibilidad con el despliegue en Raspberry Pi. A
continuación se detalla cada elección y su justificación frente a las alternativas
consideradas.

2.1 Hardware necesario
El sistema ha sido diseñado para funcionar de manera eficiente en entornos de
bajo consumo y es totalmente agnóstico del hardware. Sin embargo, se ha
utilizado como dispositivo principal una Raspberry Pi 5 de 8 GB de RAM debido
a su arquitectura ARM64 optimizada, su bajo consumo energético y su capacidad
suficiente para ejecutar contenedores Docker. El almacenamiento se gestiona
mediante una tarjeta MicroSD destinada al sistema operativo y un volumen
persistente para la base de datos; en este caso se ha utilizado una tarjeta de 128 GB.

La conexión de red se realiza mediante Ethernet Gigabit para asegurar baja
latencia, especialmente necesaria para el correcto funcionamiento de las
comunicaciones en tiempo real mediante WebSockets.

• Docker y Docker Compose.
  - Justificación: Garantiza que el entorno de desarrollo sea idéntico al
    de producción. Elimina el problema de "en mi máquina funciona",
    crucial al desplegar en una arquitectura diferente (ARM) como la
    Raspberry Pi.

• Raspberry Pi 5.
  - Justificación: Se busca demostrar la eficiencia del código. Si Axio
    puede ejecutarse con fluidez en un hardware de bajo consumo y
    recursos limitados, demuestra una optimización superior a si se
    desplegara en un servidor cloud con recursos abundantes.

2.2 Software necesario y Stack Tecnológico
Axio utiliza soluciones abiertas en todas sus capas. Se buscó un desarrollo rápido, buena comunicación en tiempo real, una interfaz reactiva y flexibilidad con los datos, además de integrar análisis con IA y mantener coherencia entre desarrollo y producción.

2.2.1 Backend (Servidor).
• Node.js y TypeScript.
  - Elección: Se optó por un entorno que permite manejar múltiples
    conexiones concurrentes (WebSockets). TypeScript se añade para
    proporcionar tipado estático.
  - Justificación frente a Python/Django: Aunque Python es potente
    para IA, Node.js comparte el mismo lenguaje (JS/TS) que el
    frontend, permitiendo reutilizar tipos e interfaces. Además,
    Node.js tiene un rendimiento superior en operaciones de
    Entrada/Salida para aplicaciones en tiempo real.

• Express.
  - Elección: Framework web minimalista y flexible.
  - Justificación frente a NestJS: NestJS añade una capa de
    complejidad excesiva para un MVP ágil. Express permite una
    iteración más rápida y un control más directo sobre los
    middlewares.

• Base de Datos: MongoDB (Mongoose).
  - Elección: Base de datos NoSQL adecuada para datos flexibles y
    anidados, como los resultados de auditorías de IA.
  - Justificación frente a SQL (MySQL/PostgreSQL): La estructura
    de datos del proyecto es variable (un reporte puede tener campos
    impredecibles o anidados). MongoDB permite almacenar objetos
    JSON (formato de las auditorías) sin necesidad de migraciones de
    esquemas rígidas, agilizando el desarrollo.

• Seguridad: Bcryptjs, JWT y Dotenv.
  - Justificación: JWT permite una autenticación sin estado (stateless),
    lo que reduce la carga en el servidor y facilita la escalabilidad
    horizontal, a diferencia de las sesiones tradicionales basadas en
    cookies. Dotenv se encarga de cargar las variables de entorno
    (MONGO_URI, JWT_SECRET, GEMINI_API_KEY) desde un archivo .env,
    manteniendo las credenciales fuera del código fuente.

2.2.2 Frontend (Cliente).
La interfaz es una Single Page Application construida con React.

• React y Vite.
  - Elección: Librería de UI basada en componentes y bundler de
    última generación.
  - Justificación frente a Angular: React ofrece una curva de
    aprendizaje más adaptada al tiempo disponible del proyecto y una
    mayor flexibilidad. Vite se eligió sobre Create React App por ser
    significativamente más rápido en el arranque del servidor de
    desarrollo y en la compilación (Hot Module Replacement nativo).

• Tailwind CSS.
  - Elección: Framework CSS utility-first que permite un diseño
    completamente personalizado y optimizado.
  - Justificación frente a Bootstrap/MUI: Bootstrap impone un
    diseño muy genérico difícil de personalizar sin sobreescribir
    estilos. Tailwind permite construir una interfaz totalmente
    personalizada sin salir del HTML, reduciendo el tamaño final del
    CSS al eliminar las clases no utilizadas en producción (tree-shaking).

• Servidor Web: Nginx.
  - Elección: Servidor web ligero de alto rendimiento con arquitectura
    dirigida por eventos.
  - Justificación frente a Apache: Nginx consume significativamente
    menos memoria bajo carga, lo cual es crítico en un entorno de
    recursos limitados como la Raspberry Pi.

• Comunicación: Axios y Socket.IO.
  - Justificación (Socket.IO vs WebSockets nativos): Socket.IO
    gestiona automáticamente las reconexiones y ofrece el concepto de
    "salas" (rooms), lo cual simplifica la lógica al aislar a los usuarios
    en diferentes proyectos colaborativos. Además, proporciona
    fallback a HTTP long-polling cuando los WebSockets nativos no
    están disponibles, algo necesario al operar tras túneles como
    Cloudflare.

2.2.3 Servicios especializados.
• IA: Google Gemini 2.5 Flash.
  - Justificación frente a OpenAI (GPT-4 Vision): Gemini Flash
    ofrece una ventana de contexto amplia y, de forma determinante
    para este proyecto, es más rápido y económico (con un tier gratuito
    suficiente) para el análisis de imágenes, lo cual es vital para un
    proyecto académico con recursos limitados.

• Scraping: Puppeteer.
  - Elección: Control de Chrome Headless mediante la API de
    DevTools.
  - Justificación frente a Cheerio: Cheerio solo analiza HTML
    estático. Las webs modernas (React, Vue, Angular) requieren
    ejecutar JavaScript para renderizar su contenido. Puppeteer
    permite capturar la web tal cual la ve el usuario, incluyendo estilos
    y scripts ejecutados en cliente.

2.3 Patrón de arquitectura
Se ha implementado una arquitectura basada en servicios contenerizados
(orquestados con Docker Compose) con un patrón de diseño MVC (Modelo-Vista-
Controlador) en el backend.

• Nivel de infraestructura: Cada servicio (MongoDB, Redis, backend,
frontend, Mongo Express, n8n) se ejecuta en su propio contenedor aislado,
comunicándose a través de una red virtual interna de Docker. Esto garantiza
el aislamiento de procesos y la portabilidad entre entornos (desarrollo local
y Raspberry Pi ARM64). El contenedor Redis está aprovisionado para su uso
futuro como caché distribuida y almacenamiento de sesiones de Socket.IO; en
la versión actual, la limitación de tasa se gestiona en memoria y las sesiones
WebSocket residen en el proceso de Node.js.

[DIAGRAMA 1 - Arquitectura de contenedores Docker: diagrama que muestre los
6 contenedores (MongoDB, Redis, Backend Node/Express, Frontend Nginx,
Mongo Express, n8n) y sus conexiones de red internas, puertos expuestos y
volúmenes persistentes.]

• Nivel de aplicación:
  - Modelo (Model): Definición de esquemas de datos con Mongoose
    (User, Project, Audit, Pin, Conversation, Message, Notification,
    Admin, SiteConfig).
  - Controlador (Controller): Lógica de negocio que procesa las
    peticiones HTTP y orquesta los servicios (IA, scraping,
    notificaciones).
  - Vista (View): La vista está desacoplada y servida por el frontend
    (React SPA) a través de una API REST. El backend solo sirve
    datos en formato JSON.

[DIAGRAMA 2 - Patrón MVC en el backend: diagrama de flujo que represente
cómo una petición HTTP atraviesa el middleware (auth, upload, rate limit),
llega al controlador correspondiente, interactúa con los modelos de Mongoose
y devuelve una respuesta JSON al frontend.]

• Patrón de comunicación:
  - Síncrono (HTTP/REST): Para operaciones CRUD estándar
    (proyectos, usuarios, auditorías).
  - Asíncrono (WebSockets): Para la colaboración en tiempo real y las
    notificaciones push. Se utiliza Socket.IO con salas por proyecto y
    por usuario.

[DIAGRAMA 3 - Flujo de comunicación WebSocket: diagrama que ilustre el
flujo de eventos (join_user, join_project, send_pin, new_pin, new_dm,
notification) entre clientes y servidor a través de Socket.IO, mostrando las
salas y el patrón pub/sub.]


CAPÍTULO 3. DESARROLLO ESPECÍFICO DE LA CONTRIBUCIÓN

A continuación se explica el trabajo realizado: alcance, planificación, análisis, diseño, implementación y fase de pruebas.

1. ALCANCE

1.1 Requisitos funcionales
El proyecto abarca el ciclo completo de desarrollo de software para crear una
plataforma colaborativa. El alcance funcional implementado se divide en los
siguientes módulos:

• Módulo de Gestión de Identidad: Sistema de registro y autenticación de
usuarios mediante credenciales encriptadas (bcryptjs) y gestión de sesiones sin
estado a través de JSON Web Tokens (JWT). Incluye gestión de perfiles de
usuario, cambio de contraseña, restablecimiento de contraseña olvidada por
correo electrónico, subida de avatar y personalización de la interfaz (tema
claro/oscuro).

• Módulo de Auditoría Multimodal: Capacidad del sistema para ingerir y
analizar tres tipos de datos:
  - Navegación en tiempo real: Captura automática de sitios web públicos
    mediante scraping con Puppeteer.
  - Archivos Visuales: Procesamiento de imágenes (JPG, PNG) y documentos
    PDF (diseños, mockups).
  - Código Fuente: Análisis semántico de archivos de texto (HTML, CSS,
    JavaScript, TypeScript).

• Módulo de Inteligencia Artificial: Integración con el LLM Google Gemini 2.5
Flash como motor de auditoría. El sistema no solo valida sintaxis, sino que
interpreta el contexto visual y semántico para ofrecer puntuaciones de
accesibilidad (0-100) y sugerencias detalladas en formato JSON estructurado
(elemento, problema, sugerencia, severidad).

• Módulo de Visualización y Empatía: Visor de proyectos avanzado que incluye
un motor de empatía. Permite aplicar filtros SVG en tiempo real sobre la
interfaz renderizada para simular patologías visuales (protanopía,
deuteranopía, tritanopía, acromatopsía y desenfoque), permitiendo a los
desarrolladores experimentar de primera mano las barreras de accesibilidad.

• Módulo de Colaboración Síncrona: Sistema de comunicación en tiempo real
mediante Socket.IO que permite a múltiples usuarios visualizar el mismo
proyecto, colocar marcadores posicionales (pines) sobre la interfaz con
coordenadas relativas y mantener conversaciones mediante chat integrado.

• Módulo de Comunidad: Espacio público donde los usuarios pueden publicar
sus proyectos, recibir feedback mediante un sistema de votación por estrellas
(1 a 5) y likes, con persistencia de datos y cálculo de promedios estadísticos en
el servidor. Incluye filtros de exploración (recientes, populares, mejor
puntuados).

• Módulo de Mensajería Directa: Sistema de chat privado entre usuarios,
permitiendo la comunicación uno a uno con soporte para texto e imágenes.
Incluye notificaciones en tiempo real y marcado de mensajes como leídos.

• Módulo de Administración: Panel de control para administradores que permite
la gestión de usuarios (suspensión, restablecimiento de contraseñas), proyectos
(ocultación, destacado), auditorías (exportación CSV) y configuración global
del sitio (modo mantenimiento, límite de pines, tamaño máximo de subida).

• Módulo de Gamificación: Sistema de insignias que premia la actividad de los
usuarios (primer proyecto, proyectos constantes, análisis con IA, calidad +80,
participación en comunidad), visible en los perfiles públicos.

1.2 Requisitos no funcionales
Además de las funcionalidades descritas, el sistema se ha diseñado para cumplir
los siguientes requisitos no funcionales:

• Seguridad:
  - Todas las contraseñas se almacenan hasheadas con bcryptjs (salt rounds: 10).
  - La autenticación se gestiona mediante JWT con expiración de 7 días.
  - Las rutas de la API están protegidas por middleware que verifica el token.
  - Se aplica rate limiting en endpoints sensibles (login: 10 peticiones/15 min;
    restablecimiento de contraseña: 5 peticiones/15 min).
  - Los archivos subidos se validan por tipo MIME y extensión (Multer).
  - Cabeceras de seguridad configuradas con Helmet (CSP, X-Frame-Options).

• Rendimiento:
  - La comunicación en tiempo real debe mantener una latencia inferior a 500 ms
    entre el envío de un pin y su recepción por otros usuarios en el mismo proyecto.
  - Las capturas de pantalla mediante Puppeteer deben completarse en menos de
    10 segundos para URLs estándar.
  - El frontend debe presentar una puntuación mínima de 90 en Lighthouse
    Performance.

• Escalabilidad:
  - La arquitectura basada en contenedores permite escalar horizontalmente los
    servicios stateless (backend, frontend) añadiendo réplicas.
  - La autenticación sin estado (JWT) evita la dependencia de sesiones en
    servidor, facilitando el balanceo de carga.
  - MongoDB ofrece escalado horizontal nativo mediante sharding si fuese
    necesario en el futuro.

• Usabilidad:
  - Interfaz responsive con diseño adaptable a dispositivos móviles, tabletas y
    escritorio.
  - Tema oscuro y claro seleccionable por el usuario, con persistencia de la
    preferencia.
  - Sistema de texto a voz (TTS) integrado para mejorar la accesibilidad de la
    propia plataforma, activable al pasar el ratón o hacer foco sobre elementos
    interactivos.
  - Feedback visual inmediato en interacciones (estados de carga, confirmaciones
    de acciones, notificaciones toast).

• Mantenibilidad:
  - Código tipado con TypeScript en frontend y backend, facilitando la detección
    temprana de errores y la refactorización.
  - Separación clara de responsabilidades mediante el patrón MVC en el backend
    y la organización por contextos (AuthContext, SocketContext, ThemeContext)
    en el frontend.
  - Docker Compose permite recrear el entorno completo de desarrollo con un
    solo comando.

1.3 Funcionalidades no incluidas en esta versión
Quedan fuera del alcance de la presente versión las siguientes funcionalidades,
que se contemplan como posibles trabajos futuros:

• Pasarela de pago o modelo de suscripción: La plataforma se concibe como
un proyecto académico sin fines comerciales en su versión actual.
• Aplicación móvil nativa: El acceso se realiza exclusivamente mediante
navegador web, contando con un diseño responsivo adaptado a dispositivos
móviles, pero sin una app nativa para iOS o Android.
• Integración con lectores de pantalla externos (JAWS, NVDA): Aunque la
plataforma incluye su propio sistema de texto a voz (TTS) como ayuda a la
navegación, no se integra con software de accesibilidad de terceros.
• Análisis de contenido multimedia animado: El motor de auditoría se limita
a imágenes estáticas, PDFs, código fuente y páginas web. No se procesan
vídeos, animaciones o contenido interactivo complejo.
• Soporte multilingüe completo: La interfaz de usuario y los reportes de
auditoría están disponibles únicamente en español.
• Automatización de correcciones: La IA emite sugerencias de mejora pero no
aplica cambios automáticamente sobre el código o diseño del proyecto
auditado. La implementación de las correcciones queda a criterio del usuario.
• Testing automatizado: No se incluye una suite de tests unitarios o de
integración en el alcance de esta versión.


2. PLANIFICACIÓN
Para la gestión del proyecto se ha adoptado la metodología SCRUM, adaptada al
contexto de un único desarrollador. En este enfoque, la misma persona asume
todos los roles y organiza el trabajo en 6 Sprints, permitiendo planificar,
desarrollar y revisar avances de forma iterativa. Esta adaptación garantiza una
ir sacando versiones funcionales del software poco a poco.

Aunque no hay un equipo con quien reunirse, realizo un breve seguimiento diario
respondiendo a tres preguntas: ¿Qué hice ayer?, ¿qué haré hoy?, ¿hay algún
impedimento? Al final de cada Sprint se documenta como control interno.

Sprint 1. Cimientos y seguridad.
1. Configuración del repositorio y entorno de desarrollo.
2. Levantamiento de infraestructura inicial con Docker (MongoDB),
inicialmente en el entorno local.
3. Implementación del servidor Express y el sistema de autenticación
   (registro, login, JWT, bcryptjs).

Sprint 2. El Cerebro.
1. Desarrollo de los controladores de análisis.
2. Integración del SDK de Google Generative AI (Gemini 2.5 Flash).
3. Implementación del servicio de Web Scraping con Puppeteer para
   capturas de pantalla automatizadas.
4. Configuración de Multer para la gestión de subida de archivos
   (imágenes, PDFs, código fuente).

Sprint 3. Interfaz del usuario.
1. Arquitectura del cliente en React + Vite.
2. Implementación del AuthContext (gestión de estado de autenticación
   que informa a la interfaz si el usuario está logueado y quién es) y
   protección de rutas.
3. Desarrollo del Dashboard principal y la vista de gestión de portafolio
   ("Mis Proyectos").
4. Conexión con la API REST mediante Axios con interceptores para la
   inyección automática del token JWT.

Sprint 4. Experiencia de Usuario.
1. Desarrollo de la vista detallada de proyecto (ProjectView).
2. Implementación de la lógica de filtros visuales mediante matrices de
   color SVG para la simulación de patologías (protanopía, deuteranopía,
   tritanopía, acromatopsía, desenfoque).
3. Adaptación del visor para soportar renderizado condicional según el
   tipo de archivo: imagen/URL (canvas interactivo con filtros), PDF
   (visor embebido) o código (visor con resaltado de sintaxis).

Sprint 5. Colaboración y Comunidad.
1. Configuración del servidor de WebSockets (Socket.IO) y gestión de
   salas por proyecto y por usuario.
2. Desarrollo del componente PinLayer para la colocación de anotaciones
   con coordenadas relativas (porcentaje X, Y) sobre la imagen del proyecto.
3. Implementación del módulo "Explorar" (Comunidad) con lógica de
   votación por estrellas, likes, filtrado por popularidad y persistencia de
   interacciones sociales.
4. Desarrollo del sistema de mensajería directa (chat privado) entre
   usuarios.

Sprint 6. Infraestructura y Despliegue.
1. Dockerización final de la aplicación (frontend + backend + MongoDB +
   Redis + n8n).
2. Configuración de Nginx como servidor web y proxy inverso.
3. Integración de n8n para automatización de notificaciones (webhooks).
4. Despliegue y validación del entorno de producción en Raspberry Pi 5.

2.1 Planificación de tareas
A continuación, se presenta un desglose de las actividades necesarias para el
proyecto, organizadas por nivel de abstracción.

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
contenedores de MongoDB, Redis, backend, frontend, Mongo Express y n8n.
• Configuración de volúmenes y redes internas de Docker para aislar los
servicios.

Backend (Node.js/Express).
• Implementación del middleware Multer para la recepción, validación de
tipos de archivo y almacenamiento temporal.
• Desarrollo del servicio de conexión con la API de Google Gemini,
aplicando técnicas de Prompt Engineering para optimizar las respuestas
JSON.
• Diseño y creación de esquemas de datos en Mongoose para las
colecciones de Usuarios, Proyectos, Auditorías y Anotaciones.

Frontend (React/TypeScript).
• Configuración del entorno de desarrollo con Vite, TypeScript y Tailwind
CSS.
• Desarrollo del componente Canvas capaz de renderizar imágenes y
capturar coordenadas relativas (X, Y) del ratón con precisión.
• Implementación de la lógica de cliente para WebSockets (socket.io-client)
gestionando la recepción y pintado de pines en tiempo real.
• Programación de filtros CSS dinámicos para la simulación de patologías
visuales.

2.2 Metodología de seguimiento
Para la gestión de Axio se ha optado por una metodología SCRUM adaptada al
desarrollo individual, utilizando Trello como herramienta principal de seguimiento.
El proyecto se ha fragmentado en hitos académicos y de desarrollo para asegurar
un buen control de las tareas y el cumplimiento de los plazos fijados.

2.2.1 Estructura de trabajo en Trello
Se ha definido un tablero independiente por cada hito del proyecto. Cada tablero
utiliza un flujo de trabajo de cinco columnas para maximizar la visibilidad del
progreso:

• Backlog: Tareas identificadas pendientes de inicio.
• To Do: Tareas priorizadas para la iteración actual.
• En curso: Tareas activas en desarrollo.
• Review: Fase de validación técnica y QA.
• Terminado: Tareas finalizadas que cumplen la definición de completado.

[IMAGEN - Tablero de Trello: captura de pantalla del tablero de uno de los
hitos mostrando las cinco columnas del flujo de trabajo con tarjetas de tareas.]

2.3 Hitos del proyecto
Los hitos del proyecto, vistos desde los entregables académicos y como complemento a los Sprints ya descritos, fueron los siguientes:

2.3.1 Hito 1: Anteproyecto
Estado: Finalizado (Entrega: 05/12/2025).
En esta fase se definieron los objetivos del proyecto, el stack tecnológico y la
justificación legal basada en el Acta Europea de Accesibilidad 2025. Se elaboró
el documento inicial de anteproyecto con el alcance, la motivación y la
planificación preliminar.

[IMAGEN - Documento de anteproyecto: portada o extracto del documento
de anteproyecto entregado.]

2.3.2 Hito 2: Análisis Funcional
Estado: Finalizado (Entrega: 12/12/2025).
Incluye el diseño del modelo de datos NoSQL con Mongoose, los diagramas de
arquitectura del sistema, la redacción de los casos de uso principales y el diseño
de la API REST con sus endpoints.

[IMAGEN - Diagrama de arquitectura: diagrama de componentes y flujo de
datos elaborado durante la fase de análisis funcional.]

2.3.3 Hito 3: Plan de Pruebas
Estado: Finalizado (Entrega: 19/12/2025).
Definición de la estrategia Shift-Left Testing y selección de herramientas (Postman,
Selenium). Se elaboró el documento de plan de pruebas con los tipos de pruebas,
casos de prueba y ciclo de ejecución previsto.

[IMAGEN - Documento de plan de pruebas: portada o esquema del plan de
pruebas elaborado.]

2.3.4 Hito 4: Desarrollo
Estado: Ejecutado (Sprints 1 a 6, finalizado en enero 2026).
Este hito segmenta el desarrollo técnico en módulos de Backend, Frontend e
Infraestructura, desglosando las historias de usuario en tareas atómicas dentro de
Trello. El detalle de cada Sprint se encuentra en la sección 2 de este capítulo.

[IMAGEN - Tablero Trello del hito de desarrollo: captura mostrando las
tarjetas de tareas del backend y frontend organizadas por columnas.]

2.4 Tabla de planificación
La tabla siguiente cruza los hitos académicos con los Sprints de desarrollo y sus fechas de entrega:

[IMAGEN - Tabla de planificación: tabla con columnas para Hito, Sprint,
fechas de inicio y fin, entregable y estado, mostrando la cronología completa
del proyecto desde diciembre 2025 hasta enero 2026.]

2.5 Definición del MVP (Producto Mínimo Viable)
Se ha definido un MVP centrado en las funcionalidades esenciales para garantizar
una defensa exitosa del proyecto. El objetivo es mitigar riesgos temporales
asegurando que el producto está completo con lo realmente necesario.

Características esenciales del MVP de Axio:

1. Gestión de Identidad: Registro y login funcional con seguridad mediante JWT
y contraseñas hasheadas con bcryptjs. El sistema debe permitir el registro de
nuevos usuarios, el inicio de sesión, la protección de rutas privadas y el cierre
de sesión.

2. Auditoría Core: Capacidad de procesar una imagen (JPG, PNG) y obtener un
análisis de accesibilidad mediante IA Gemini. El sistema debe devolver una
puntuación numérica y un listado de problemas detectados con sugerencias de
mejora.

3. Visor de Empatía: Implementación de filtros SVG de simulación visual sobre
la imagen del proyecto auditado. Debe incluir al menos los filtros de
protanopía, deuteranopía, tritanopía, acromatopsía y desenfoque.

4. Despliegue Estable: Ejecución de la aplicación completa (frontend, backend
y base de datos) mediante contenedores Docker en el entorno local de
desarrollo, garantizando que el proyecto puede levantarse con un solo comando
(docker compose up).

Estas cuatro características forman la base funcional que asegura
la viabilidad del proyecto. Las funcionalidades adicionales (comunidad, chat,
mensajería, gamificación, panel de administración) se han desarrollado como
funcionalidades añadidas sobre esta base.


3. DESARROLLO DEL PROYECTO

3.1 ANÁLISIS

3.1.1 Casos de uso principales
Los casos de uso más representativos del sistema, que sirvieron de guía para el diseño y la implementación, son los siguientes:

[DIAGRAMA 4 - Diagrama de casos de uso: diagrama UML que muestre los
actores (Usuario no registrado, Usuario registrado, Desarrollador, Revisor,
Administrador) y sus relaciones con los casos de uso principales: Registro,
Login, Subir proyecto, Analizar con IA, Aplicar filtros visuales, Colocar pin,
Votar proyecto, Enviar mensaje, Gestionar usuarios (admin).]

Caso de uso 1: Registro y autenticación de usuario.
• Actor: Usuario no registrado.
• Precondición: El usuario accede a la plataforma por primera vez.
• Flujo principal:
  1. El usuario completa el formulario de registro (nombre de usuario, email,
     contraseña).
  2. El sistema valida el formato de los campos y la fortaleza de la contraseña.
  3. El sistema verifica que el email y el nombre de usuario no estén ya en uso.
  4. El sistema almacena el usuario con la contraseña hasheada.
  5. El sistema emite un token JWT y redirige al dashboard.
• Postcondición: El usuario queda autenticado y puede acceder a las funciones
privadas de la plataforma.

Caso de uso 2: Auditoría de un sitio web mediante URL.
• Actor: Usuario registrado (Desarrollador).
• Precondición: El usuario ha iniciado sesión.
• Flujo principal:
  1. El usuario introduce una URL en el formulario de nueva auditoría.
  2. El backend lanza Puppeteer para navegar a la URL y capturar una
     captura de pantalla completa.
  3. La imagen capturada se envía a la API de Google Gemini 2.5 Flash para
     su análisis multimodal.
  4. Gemini devuelve un JSON con la puntuación de accesibilidad y una lista
     de incidencias detectadas (elemento, problema, sugerencia, severidad).
  5. El sistema crea un documento Project y un documento Audit vinculado
     en MongoDB.
  6. El frontend muestra el resultado en el visor de proyecto.
• Postcondición: El proyecto queda registrado con su auditoría y el usuario
puede visualizar los resultados, aplicar filtros sensoriales y compartirlo.

Caso de uso 3: Colaboración mediante pines en un proyecto.
• Actor: Usuario registrado (Revisor, Desarrollador).
• Precondición: Existe un proyecto con una imagen o captura renderizada.
• Flujo principal:
  1. El usuario accede a la vista de proyecto (ProjectView).
  2. El cliente se conecta a la sala WebSocket del proyecto.
  3. El usuario hace clic en un punto de la imagen para colocar un pin.
  4. El sistema captura las coordenadas relativas (X%, Y%) respecto al
     tamaño del contenedor.
  5. El usuario escribe el contenido del pin (comentario o sugerencia).
  6. El pin se envía al servidor mediante WebSocket.
  7. El servidor almacena el pin en MongoDB y lo retransmite a todos los
     clientes conectados a la sala del proyecto.
  8. El pin aparece en tiempo real en las pantallas de todos los usuarios
     que visualizan el mismo proyecto.
• Postcondición: El pin queda registrado y visible para todos los colaboradores.

Caso de uso 4: Votación y valoración en la comunidad.
• Actor: Usuario registrado.
• Precondición: Existen proyectos publicados en la sección Comunidad.
• Flujo principal:
  1. El usuario accede a la pestaña "Explorar" del dashboard.
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
  6. Puede modificar la configuración global del sitio (permitir registros,
     modo mantenimiento, límites).
  7. Todas las acciones quedan registradas en un activity log.
• Postcondición: Los cambios se aplican en el sistema y quedan registrados.

Caso de uso 6: Recuperación de contraseña olvidada.
• Actor: Usuario registrado (sin sesión iniciada).
• Precondición: El usuario ha olvidado su contraseña y no puede iniciar sesión.
• Flujo principal:
  1. El usuario introduce su email en el formulario de recuperación.
  2. El sistema busca el email en la base de datos y genera un token único
     (SHA256 hasheado) con expiración de una hora.
  3. El token se guarda en el documento del usuario (campos resetPasswordToken
     y resetPasswordExpires) y se devuelve al usuario para pruebas (en un
     entorno real se enviaría por email).
  4. El usuario accede a la ruta /reset-password/:token e introduce su nueva
     contraseña.
  5. El sistema valida el token (existe, no ha expirado), actualiza la contraseña
     con bcryptjs y elimina los campos de recuperación.
• Flujo alternativo: Si el token ha expirado o no existe, el sistema muestra un
mensaje de error y ofrece solicitar uno nuevo.
• Postcondición: El usuario puede iniciar sesión con su nueva contraseña.

Caso de uso 7: Mensajería directa entre usuarios.
• Actor: Usuario registrado.
• Precondición: El usuario quiere comunicarse de forma privada con otro usuario.
• Flujo principal:
  1. El usuario accede a la pestaña "Mensajes" del dashboard o al perfil del
     destinatario.
  2. El sistema busca si ya existe una conversación entre ambos (índice compuesto
     en MongoDB sobre los dos participantes).
  3. Si no existe, se crea una nueva conversación; si existe, se recuperan los
     mensajes previos.
  4. El usuario escribe un texto (máximo 2000 caracteres) y lo envía. El mensaje
     se persiste en la colección Message vinculado a la conversación.
  5. El servidor emite un evento new_dm a través de Socket.IO a la sala del
     usuario destinatario (user:{id}).
  6. El destinatario recibe una notificación en tiempo real y puede responder.
• Flujo alternativo: Si el usuario envía una imagen, Multer la procesa y la URL
se almacena en el campo image del mensaje en lugar del campo text.
• Postcondición: Ambos usuarios pueden continuar la conversación de forma
asíncrona. Los mensajes no leídos se marcan al entrar en la conversación.

Caso de uso 8: Explorar y filtrar proyectos en la comunidad.
• Actor: Usuario registrado.
• Precondición: Existen proyectos públicos en la plataforma.
• Flujo principal:
  1. El usuario accede a la pestaña "Comunidad" del dashboard.
  2. El sistema carga la lista de proyectos no ocultos con sus metadatos (título,
     autor, puntuación, imagen, número de likes, valoración media, cantidad de
     comentarios/pines).
  3. El usuario puede ordenar por: más recientes, más populares (likes) o mejor
     puntuados (averageRating).
  4. El usuario puede dar like a un proyecto (toggle: lo añade o lo retira del
     array de likes del proyecto) y votar con una puntuación de 1 a 5 estrellas.
  5. El backend recalcula el averageRating promediando todas las valoraciones
     del array ratings.
• Postcondición: La lista se reordena según el filtro seleccionado y las
interacciones del usuario quedan reflejadas.

Caso de uso 9: Eliminación de un proyecto propio.
• Actor: Usuario registrado (propietario del proyecto).
• Precondición: El usuario ha creado previamente un proyecto.
• Flujo principal:
  1. El usuario accede a "Mis Proyectos" y localiza el proyecto que desea eliminar.
  2. El sistema solicita confirmación para evitar eliminaciones accidentales.
  3. Al confirmar, el backend verifica que el usuario autenticado es el propietario
     (campo owner del proyecto).
  4. Se elimina el documento Project y sus documentos vinculados (Audit, Pin).
  5. La lista de proyectos se actualiza en el frontend.
• Flujo alternativo: Si el usuario no es el propietario, el backend rechaza la
petición con código 403.
• Postcondición: El proyecto y todos sus datos asociados desaparecen del sistema.

Caso de uso 10: Subida de archivo para auditoría con IA.
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

3.1.2 Modelo de datos (visión general)
El sistema utiliza MongoDB como base de datos NoSQL, con 9 colecciones
principales modeladas mediante Mongoose:

[DIAGRAMA 5 - Diagrama Entidad-Relación: diagrama que muestre las 9
colecciones (User, Project, Audit, Pin, Conversation, Message, Notification,
Admin, SiteConfig) y las relaciones entre ellas mediante referencias ObjectId.]

• User: Almacena los datos de los usuarios registrados (username, email,
password hasheado, avatar, biografía, rol, estado de suspensión).
• Project: Representa un proyecto auditado (título, propietario, tipo de
entrada, captura de imagen, puntuación de accesibilidad, likes, valoraciones,
estado de visibilidad).
• Audit: Contiene el resultado del análisis de IA vinculado a un proyecto
(puntuación numérica, array de incidencias con elemento, problema,
sugerencia y severidad, respuesta bruta del modelo).
• Pin: Anotación colaborativa sobre un proyecto (coordenadas X e Y en
porcentaje, contenido textual, autor, estado de visibilidad).
• Conversation: Conversación privada entre dos usuarios (array de dos
participantes, último mensaje, fecha de última actividad).
• Message: Mensaje individual dentro de una conversación (emisor, receptor,
texto o imagen, marca de lectura).
• Notification: Notificación push para un usuario (tipo: mensaje directo o
pin, título, cuerpo, datos adicionales, marca de lectura).
• Admin: Registro de permisos de administrador vinculado a un usuario
(permisos granulares por módulo, activity log, estado activo).
• SiteConfig: Configuración global del sitio como documento único
(permitir registros, modo mantenimiento, máximo de pines por proyecto,
tamaño máximo de subida de archivos).


3.2 DISEÑO

3.2.1 Diseño del modelo de datos
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

Para el modelo Conversation, se utiliza un índice compuesto sobre el array de
participants que permite encontrar rápidamente si ya existe una conversación entre
dos usuarios.

[DIAGRAMA 6 - Esquema detallado del modelo User: diagrama que muestre los
campos del modelo User con sus tipos de datos, validaciones y opciones
(password con select:false, resetPasswordToken con select:false, timestamps).]

Campos del modelo User (definidos en server/src/models/User.ts):

| Campo | Tipo | Validaciones |
|---|---|---|
| username | String | required, unique, minlength:3, trim |
| email | String | required, unique, lowercase, match regex |
| password | String | required, minlength:6, select:false |
| avatar | String | default:'' |
| bio | String | maxlength:65, trim, default:'' |
| role | String | enum:['user','admin'], default:'user' |
| isSuspended | Boolean | default:false |
| suspendedAt | Date | - |
| suspensionReason | String | trim |
| resetPasswordToken | String | select:false |
| resetPasswordExpires | Date | select:false |
| createdAt/updatedAt | Date | timestamps:true (automático) |

[DIAGRAMA 7 - Esquema detallado del modelo Audit: diagrama que muestre la
estructura del array issues con sus subcampos (element, problem, suggestion,
severity) y el campo score (0-100).]

Campos del modelo Audit (server/src/models/Audit.ts):

| Campo | Tipo | Validaciones |
|---|---|---|
| score | Number | required, min:0, max:100 |
| issues | Array[Object] | subcampos: element(String), problem(String), suggestion(String), severity(String) |
| rawResponse | String | respuesta bruta del modelo Gemini |
| project | ObjectId (ref Project) | vinculación al proyecto auditado |
| createdAt/updatedAt | Date | timestamps:true (automático) |

3.2.2 Diseño de la interfaz de usuario
La interfaz de usuario se estructura como una Single Page Application (SPA)
con React Router para la navegación. Las páginas principales son:

• Home (/): Landing page pública con información del proyecto y enlaces
a registro y login.
• Login (/login) y Register (/register): Formularios de autenticación.
• Dashboard (/dashboard): Punto central de la aplicación tras el login.
Organizado en pestañas: Nueva Auditoría, Mis Proyectos, Comunidad,
Mensajes, Configuración, Administración (solo admin).
• ProjectView (/project/:id): Visor detallado de un proyecto con el motor
de empatía (filtros), capa de pines colaborativos y chat lateral.
• Messages (/messages): Sistema de mensajería directa con lista de
conversaciones y chat.
• Profile (/u/:username): Perfil público de usuario con sus proyectos,
estadísticas e insignias.
• Admin (/admin): Panel de administración con gestión de usuarios,
proyectos, auditorías y configuración.

El diseño visual utiliza Tailwind CSS con una paleta de colores adaptable a tema
claro y oscuro. Las transiciones de tema se aplican mediante clases condicionales
(dark:) de Tailwind, gestionadas por ThemeContext, que persiste la preferencia en
localStorage para mantener la elección entre sesiones. Los componentes siguen un
patrón de composición: las páginas se construyen a partir de componentes
reutilizables (botones, tarjetas, modales, indicadores de carga) que heredan los
estilos del tema activo.

3.2.3 Decisiones de diseño visual
La identidad visual de Axio persigue un aspecto moderno y técnico. Se han tomado
las siguientes decisiones:

• Efectos de glassmorphism: Las tarjetas de proyecto y los paneles del dashboard
utilizan fondos semitransparentes con desenfoque (backdrop-blur de Tailwind)
y bordes sutiles. Esta técnica da profundidad a la interfaz sin sacrificar la
legibilidad, especialmente en el tema oscuro.

• Paleta de colores: Se ha definido una escala de azules para los elementos
interactivos y acentos, combinada con grises neutros para fondos y superficies.
En el tema oscuro, los fondos tienden a tonos muy oscuros (casi negros) para
reducir la fatiga visual en sesiones prolongadas de revisión de proyectos.

• Tipografía: Se utiliza la familia sans-serif del sistema operativo, lo que evita
cargas adicionales de fuentes web y garantiza una renderización nativa óptima
en cualquier dispositivo.

• Iconografía: La librería Lucide React proporciona un conjunto de iconos
consistentes y ligeros. Los iconos complementan las etiquetas de texto pero
nunca las sustituyen, manteniendo la accesibilidad.

3.2.4 Diseño responsive
La interfaz se ha diseñado con un enfoque mobile-first usando las utilidades
responsive de Tailwind (sm:, md:, lg:, xl:).

• Escritorio (>1024px): El dashboard muestra una barra lateral de navegación
fija a la izquierda. La vista de proyecto divide el espacio entre el visor
principal y un panel lateral con los pines y el chat. La tabla de administración
aprovecha todo el ancho disponible.

• Tableta (768px-1024px): La barra lateral se colapsa en un menú desplegable.
El visor de proyecto apila el contenido verticalmente: primero la imagen, luego
los filtros y debajo los pines.

• Móvil (<768px): El menú se convierte en un botón hamburguesa. Las tarjetas
de proyecto se muestran en una sola columna. El canvas de pines se adapta
manteniendo las coordenadas relativas (porcentaje) para que los marcadores
no se descoloquen al cambiar el tamaño de pantalla.

3.2.5 Componentes clave del Dashboard
El Dashboard actúa como contenedor principal tras el login. Su arquitectura interna
se basa en:

• Barra superior: Muestra el logo, el nombre del usuario, un interruptor de tema
(claro/oscuro), un toggle de accesibilidad TTS y el acceso al perfil y cierre de
sesión.

• Panel de pestañas: Siete pestañas que representan los módulos principales:
Nueva Auditoría, Mis Proyectos, Comunidad, Mensajes, Configuración,
Administración (solo admin), y Perfil. La pestaña activa se persiste en
sessionStorage para que al recargar la página se mantenga la selección.

• Área de contenido: Renderiza condicionalmente el componente correspondiente
a la pestaña activa. MyProjects, Explore y Settings se implementan como
componentes internos del dashboard, mientras que Messages y ProjectView se
navegan mediante rutas de React Router para permitir enlaces directos.

3.2.6 Accesibilidad de la propia plataforma
Axio se ha diseñado para ser accesible en sí misma, predicando con el ejemplo:

• Skip link: Un enlace oculto que aparece al recibir el foco del teclado permite
saltar directamente al contenido principal, evitando la navegación repetitiva.

• Texto a voz integrado: Mediante la Web Speech API, los elementos
interactivos con el atributo data-speech se leen en voz alta al pasar el ratón
o recibir el foco. Esta función se puede desactivar desde la barra superior.

• Navegación por teclado: Todos los elementos interactivos son accesibles
mediante Tab. Los modales capturan el foco y se cierran con Escape. Los
botones incluyen estados de focus visibles.

• Atributos ARIA: Se han añadido roles (navigation, main, dialog, log),
aria-labels en iconos sin texto y aria-live para anunciar cambios dinámicos
como nuevos mensajes o notificaciones.

• Contraste: La paleta de colores se ha verificado para cumplir con una
relación de contraste mínima de 4.5:1 en texto normal y 3:1 en texto grande,
siguiendo las pautas WCAG 2.1 nivel AA.

[DIAGRAMA 8 - Mapa de navegación de la SPA: diagrama que muestre las rutas
de React Router, indicando cuáles son públicas, cuáles requieren autenticación
y cuáles requieren rol de administrador.]

3.3 IMPLEMENTACIÓN

3.3.1 Backend (Node.js + Express + TypeScript)
El backend se ha implementado siguiendo el patrón MVC y se estructura en las
siguientes capas:

• Routes (9 archivos): Definen los endpoints REST de la API, agrupados
por dominio funcional (auth, analyze, projects, pins, users, messages,
notifications, stats, admin). Cada archivo de rutas asocia un verbo HTTP
y una ruta con su controlador correspondiente, aplicando middlewares de
protección (autenticación JWT, permisos de administrador) y de subida de
archivos (Multer) según corresponda.

• Controllers (9 archivos): Contienen la lógica de negocio. Cada controlador
recibe la petición HTTP, valida los datos de entrada, interactúa con los
modelos de Mongoose y devuelve una respuesta JSON con el código de
estado HTTP apropiado. Ejemplos destacados:
  - analyzeController.ts: Implementa dos flujos de análisis expuestos como
    endpoints públicos: analyzeImage (para archivos subidos: imágenes, PDFs
    y código fuente) y analyzeUrl (para URLs capturadas con Puppeteer).
    Ambos métodos utilizan internamente funciones helper (analyzeCode para
    archivos de texto y analyzeVisual para imágenes) que invocan el SDK de
    Google Generative AI. El resultado se parsea y se persiste como un
    documento Audit vinculado al Project.
  - projectController.ts: Gestiona el CRUD de proyectos, la lógica de
    likes (toggle atómico) y la votación por estrellas (con recálculo del
    promedio).
  - adminController.ts: Implementa operaciones administrativas con
    registro de actividad (activity log) para auditoría de cambios.

• Models (9 archivos): Esquemas de Mongoose con validaciones,
referencias entre colecciones e índices para optimizar consultas frecuentes.

• Middlewares (3 archivos):
  - auth.ts: Tres niveles de protección. El middleware protect extrae el token
    JWT de la cabecera Authorization, lo verifica con la clave secreta del entorno
    y adjunta el usuario al objeto req. Además comprueba que el usuario no esté
    suspendido (isSuspended), rechazando la petición con código 403 en ese
    caso. requireAdmin verifica que el rol del usuario sea "admin". Como capa
    adicional, requirePermission comprueba permisos granulares definidos en la
    colección Admin (gestionar usuarios, proyectos, auditorías, pines). Si un
    usuario tiene role='admin' en la colección User pero no tiene documento en
    la colección Admin, el middleware lo crea automáticamente con todos los
    permisos activados, garantizando retrocompatibilidad con administradores
    creados antes de implementar el sistema de permisos granulares.
  - upload.ts: Configuración de Multer con destino en ./uploads/. Define filtros
    por tipo MIME (image/jpeg, image/png, application/pdf, text/plain,
    text/html, text/css, text/javascript, application/typescript entre otros) y
    por extensión de archivo. El límite de tamaño se establece en 10 MB.
  - rateLimit.ts: Implementación propia de limitación de tasa usando un Map en
    memoria. Cada entrada almacena un contador de peticiones y una marca de
    tiempo. Al recibir una petición, se comprueba si la IP ha superado el límite
    en la ventana de tiempo configurada (por defecto 15 minutos). Si el límite se
    excede, se devuelve código 429. No se ha usado express-rate-limit ni otras
    librerías externas para mantener un control preciso sobre el comportamiento y
    evitar dependencias adicionales en un proyecto con despliegue en ARM.

• Services (1 archivo):
  - webScraper.ts: Encapsula la lógica de Puppeteer para la captura de
    páginas web. La función scrapeUrl(url) lanza un navegador headless,
    navega a la URL proporcionada con un viewport de 1280x800 píxeles,
    espera a que el evento load se complete y toma una captura de pantalla
    completa en formato JPEG. La ruta del ejecutable de Chromium se detecta
    automáticamente: si existe la variable de entorno PUPPETEER_EXECUTABLE_PATH
    se usa ese valor; en caso contrario, se busca en las rutas típicas de ARM/Linux
    (/usr/bin/chromium-browser, /usr/bin/chromium). Esto permite que el mismo
    código funcione en desarrollo local (Windows, donde Puppeteer descarga su
    propio Chromium) y en producción (Raspberry Pi ARM64, donde Chromium
    se instala como paquete del sistema). El navegador se cierra siempre en un
    bloque finally para evitar fugas de memoria.

• Utils (4 archivos):
  - jwt.ts: Obtiene la clave secreta JWT desde la variable de entorno JWT_SECRET,
    con un valor por defecto para desarrollo. Centraliza la configuración para que
    auth.ts y app.ts accedan a la misma clave sin duplicar la lectura de entorno.
  - socket.ts: Implementa un patrón singleton para la instancia de Socket.IO.
    getIo() devuelve la instancia y setIo(io) la establece durante la inicialización
    en app.ts. Este patrón permite que los controladores (que se ejecutan en el
    contexto de peticiones HTTP) emitan eventos WebSocket a los clientes sin
    necesidad de pasar la instancia como parámetro en cada función. Por ejemplo,
    cuando un usuario envía un mensaje directo, el messageController usa getIo()
    para emitir el evento new_dm a la sala del destinatario.
  - badges.ts: Contiene la lógica de gamificación. La función getUserBadges(userId)
    consulta los proyectos del usuario y evalúa cinco condiciones: si tiene al menos
    un proyecto (Primer Proyecto), si tiene 5 o más (Constante), si ha usado la IA
    en al menos 3 (Análisis Activo), si algún proyecto supera los 80 puntos de
    accesibilidad (Calidad +80) y si ha recibido 10 o más likes en total (Comunidad).
    Cada insignia cumplida se añade a un array que se muestra en el perfil público
    del usuario.
  - siteConfig.ts: Recupera (o crea si no existe) el documento único SiteConfig
    de MongoDB. Funciona como una caché de configuración global consultada
    por middlewares y controladores: el middleware de registro comprueba
    allowRegistration antes de procesar altas, y Multer consulta maxUploadMb
    para establecer el límite dinámico de tamaño de archivo.

• Socket.IO: El servidor WebSocket se inicializa junto con Express en
app.ts. Se gestionan dos tipos de salas: por usuario (user:{id} para
notificaciones privadas) y por proyecto (project:{id} para colaboración).
Los eventos manejados por el servidor son: join_user, join_project,
send_pin (crea el pin, lo persiste en MongoDB y lo retransmite como
new_pin a todos los clientes de la sala), new_dm y notification. La
eliminación de pines se realiza mediante la API REST (DELETE /api/pins/:id)
y no se retransmite por WebSocket.

3.3.2 Frontend (React + Vite + TypeScript)
El frontend se ha implementado como una SPA con las siguientes capas:

• Context API (3 contextos globales):
  - AuthContext: Gestiona el estado de autenticación (usuario actual,
    token JWT, funciones de login, registro y logout). El token se
    persiste en localStorage.
  - SocketContext: Establece y mantiene la conexión WebSocket con el
    servidor, proporcionando funciones para unirse a salas y enviar eventos.
  - ThemeContext: Controla el tema visual (claro/oscuro) y persiste la
    preferencia del usuario.

• Pages (13 páginas): De las 13 páginas, 10 tienen ruta propia en React
Router (Home, Login, Register, ForgotPassword, ResetPassword, Dashboard,
ProjectView, Messages, Profile y Admin), mientras que MyProjects, Settings
y Explore se renderizan como pestañas internas del componente Dashboard,
gestionadas mediante estado local con persistencia en sessionStorage.

• Servicios (2 archivos):
  - api.ts: Instancia de Axios configurada con la URL base de la API
    y un interceptor que inyecta automáticamente el token JWT en la
    cabecera Authorization de cada petición. En caso de error 401
    (token expirado), redirige al login.
  - adminService.ts: Funciones específicas para las operaciones del
    panel de administración.

• Componentes especializados:
  - A11yProvider.tsx: Implementa el sistema de texto a voz (TTS)
    mediante la Web Speech API. Al hacer hover o focus sobre elementos
    con el atributo data-speech, se lee su contenido en español. Se puede
    activar/desactivar y ajustar el volumen desde la configuración. Los
    elementos con el atributo data-speech-off quedan excluidos del TTS
    para evitar lecturas redundantes (por ejemplo, iconos decorativos).
  - PinLayer.tsx: Componente Canvas que renderiza la capa de pines
    sobre la imagen del proyecto. Gestiona la captura de coordenadas
    del ratón, el renderizado de pines existentes (recibidos por
    WebSocket) y la creación de nuevos pines.

3.3.3 Patrones de implementación relevantes

Hay varios patrones y soluciones técnicas que merece la pena explicar con más detalle por su importancia en el funcionamiento del sistema:

Interceptor de Axios y gestión del ciclo de vida del token
El archivo api.ts crea una instancia de Axios con la URL base del backend y un
interceptor de peticiones que inyecta el token JWT desde localStorage en la
cabecera Authorization. Un interceptor de respuestas captura los errores 401
(token expirado o inválido): limpia el localStorage, restablece el estado de
autenticación y redirige a /login. Este patrón evita tener que comprobar la
validez del token manualmente en cada llamada a la API. Las peticiones que
no requieren autenticación (login, registro) usan una instancia separada sin
el interceptor.

Comunicación WebSocket en el cliente
El SocketContext envuelve la aplicación y establece una única conexión
Socket.IO con el servidor. Utiliza el transporte polling (HTTP long-polling)
en lugar de WebSocket nativo, configurado así para garantizar compatibilidad
con túneles Cloudflare (cloudflared), que no soportan WebSocket en su capa
gratuita. Al montar el contexto, el cliente emite join_user con su ID para entrar
en su sala personal de notificaciones. Cada 3 segundos se ejecuta un polling
silencioso como fallback para la recepción de mensajes directos en caso de que
el canal principal falle. Los componentes que necesitan tiempo real (ProjectView,
Messages) invocan las funciones connectToProject(projectId) y
sendPin(projectId, pinData) proporcionadas por el contexto.

Motor de empatía: filtros SVG para simulación visual
La vista ProjectView incluye un panel de filtros que aplica transformaciones
visuales sobre la imagen del proyecto. Para las deuteranopías, protanopías y
tritanopías se utilizan filtros SVG feColorMatrix con matrices de color específicas
documentadas en la literatura científica. La acromatopsía (visión en escala de
grises) se implementa mediante el filtro CSS grayscale(100%). El desenfoque
que simula baja visión aplica blur(4px). Los filtros se aplican exclusivamente
sobre proyectos de tipo URL o imagen (no sobre código fuente) y se renderizan
en tiempo real sin afectar al DOM subyacente, ya que se trata de transformaciones
puramente visuales del navegador.

Pipeline de análisis con IA Gemini
El controlador analyzeController.ts ejecuta dos flujos diferentes según el tipo
de entrada. Para imágenes y PDFs, el archivo se lee como buffer y se envía a
Gemini 2.5 Flash junto con un prompt textual que le instruye para actuar como
auditor de accesibilidad WCAG 2.1, solicitando una respuesta en JSON con una
puntuación de 0 a 100 y un array de issues (element, problem, suggestion,
severity). Para código fuente, se lee el contenido textual del archivo y se envía
como parte del prompt. En el caso de URLs, Puppeteer captura la página y la
imagen resultante se envía por el mismo canal visual. Tras recibir la respuesta
de Gemini, el controlador parsea el JSON, extrae los campos esperados y
persiste el resultado en la colección Audit. Si Gemini devuelve un formato
inesperado o un error, el controlador captura la excepción y responde con un
código 422 sin interrumpir el servidor.

Flujo completo de autenticación JWT
El sistema de autenticación sigue estos pasos, extraídos directamente del código
en authController.ts y auth.ts:

1. Registro (POST /api/auth/register): El usuario envía username, email y
password. El controlador comprueba que email y username no estén ya en uso.
Genera un salt con bcrypt.genSalt(10) y hashea la contraseña con bcrypt.hash().
Crea el documento User con password hasheado y select:false (nunca se
devuelve en consultas). Responde con 201 y los datos básicos del usuario.

2. Login (POST /api/auth/login): Recibe email y password. Busca al usuario con
.select('+password') para incluir el hash. Si el usuario está suspendido
(isSuspended), devuelve 403. Compara la contraseña con bcrypt.compare().
Genera un JWT con jwt.sign({id: user._id}, secret, {expiresIn: '7d'}) usando
la clave JWT_SECRET del .env. Responde con el token y los datos del usuario.

3. Petición autenticada: El frontend envía el token en la cabecera:
Authorization: Bearer <token>. El interceptor de Axios (api.ts) lo inyecta
automáticamente desde localStorage en cada petición.

4. Middleware protect (auth.ts): Extrae el token de la cabecera. Lo verifica con
jwt.verify(token, secret). Si es válido, extrae el id del payload y lo adjunta a
req.user. Busca al usuario en BD para comprobar isSuspended. Si todo es
correcto, llama a next() y la petición llega al controlador. Si el token es inválido
o ha expirado, devuelve 401.

5. Middleware requireAdmin (auth.ts): Tras protect, busca el usuario en BD y
verifica que su role sea 'admin'. Busca o crea automáticamente un documento
Admin con todos los permisos activados. Actualiza lastLogin. Si el usuario no
es admin, devuelve 403.

6. Renovación implícita: No hay refresh token. Si el frontend recibe un 401, el
interceptor de Axios limpia localStorage y redirige a /login para que el usuario
inicie sesión de nuevo.

Prompts de Gemini utilizados
Los prompts enviados a Gemini 2.5 Flash están definidos en analyzeController.ts.
Son dos prompts distintos según el tipo de entrada:

Prompt para análisis visual (imágenes/PDFs/URLs):
"Actúa como un auditor experto en Accesibilidad Web (WCAG 2.1) y Diseño
UI/UX. Analiza esta interfaz visualmente. Detecta problemas de contraste,
tamaño de texto y distribución. Responde SOLO con JSON válido:
{ score: 0-100, issues: [{ element, problem, suggestion, severity }] }"

Prompt para análisis de código (HTML/CSS/JS/TS):
"Actúa como un auditor experto en Accesibilidad Web (WCAG 2.1) y Código
Limpio. Analiza este archivo de código fuente: <filename>. Busca errores de:
HTML semántico, etiquetas ARIA faltantes, falta de alt en imágenes.
[CODIGO: <contenido del archivo>]
Responde SOLO con JSON válido:
{ score: 0-100, issues: [{ element, problem, suggestion, severity }] }"

En ambos casos, la respuesta se limpia de marcas markdown (```json```)
antes de parsear el JSON. Si el parseo falla, se devuelve score:0 sin detener
el servidor.

Matrices de color SVG para simulación de daltonismo
Los filtros están definidos en ProjectView.tsx como elementos <filter> SVG con
feColorMatrix. Son las matrices documentadas para cada tipo de daltonismo:

Protanopía (ausencia de sensibilidad al rojo):
values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"

Deuteranopía (ausencia de sensibilidad al verde):
values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"

Tritanopía (ausencia de sensibilidad al azul):
values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"

La acromatopsía se aplica vía CSS: filter: grayscale(100%).
El desenfoque (baja visión) se aplica vía CSS: filter: blur(4px).

3.4 Fase de pruebas y QA
La calidad en Axio no se ha tratado como una fase separada al final,
sino como un proceso continuo durante todo el desarrollo
para garantizar la fiabilidad de las auditorías de IA y la estabilidad de la
colaboración en tiempo real.

3.4.1 Estrategia de pruebas
La estrategia de pruebas se ha centrado en tres objetivos:
garantizar la integridad de los datos de usuario, validar la precisión de los
reportes generados por la IA y asegurar una latencia mínima en la comunicación
mediante WebSockets.

• Relación con la metodología SCRUM: Cada Sprint ha incluido una fase de
validación que ha exigido la superación de pruebas antes de considerar una
tarea como finalizada ("Definition of Done"). Durante el Sprint 1, por
ejemplo, no se avanzó a la implementación de rutas protegidas hasta que
el sistema de autenticación (registro, login, JWT) fue verificado
manualmente con datos reales.

• Enfoque Shift-Left Testing: Se ha aplicado el testeo desde las etapas más
tempranas del desarrollo. Esto ha incluido la validación de los prompts de
la IA mediante pruebas iterativas con diferentes tipos de entrada (imágenes
con buen contraste, imágenes con texto ilegible, PDFs con estructuras
complejas) y la verificación de componentes UI en aislamiento antes de
conectarlos con la lógica del backend, permitiendo detectar errores de
diseño de forma proactiva.

3.4.2 Responsable y duración
La ejecución de las pruebas ha sido llevada a cabo por el propio alumno, Juan
Felipe Mena Vega, en el rol de QA dentro de la adaptación individual de SCRUM.
Las pruebas funcionales y manuales se han realizado de forma continua durante
los 6 Sprints del proyecto, con una dedicación estimada de 3 a 4 horas por Sprint
en tareas de verificación y validación, totalizando aproximadamente 20-24 horas
de pruebas a lo largo del ciclo de desarrollo.

3.4.3 Infraestructura de pruebas
Para minimizar los riesgos, se han mantenido entornos separados durante el
desarrollo:

• Entorno de Desarrollo (Local): Ejecución del backend mediante tsx watch
en el equipo de desarrollo local (Windows), con el frontend servido por
Vite en modo desarrollo y las React DevTools para inspeccionar el estado
de los componentes. Este entorno ha permitido pruebas unitarias rápidas
y depuración en tiempo real.

• Entorno de Testing (Docker): Un clon del entorno de producción
levantado mediante Docker Compose en local, emulando la red interna y
los volúmenes que posteriormente se desplegarían en la Raspberry Pi.
Este entorno ha sido clave para validar la comunicación entre
microservicios (MongoDB, Redis, backend, frontend) antes del despliegue
final.

3.4.4 Tipos de pruebas realizadas
Los tipos de pruebas que se ejecutaron, con ejemplos concretos y los resultados que dieron, fueron los siguientes:

1. Pruebas Unitarias: Validación de funciones aisladas ejecutadas mediante
scripts con tsx. Se han verificado casos como:
   - Ejemplo 1: Función de hashing de contraseñas con bcryptjs. Se
     comprobó que el hash generado para una misma contraseña nunca es
     idéntico (por el salt aleatorio) pero que la función compare devuelve
     true para la contraseña correcta y false para una incorrecta.
     Resultado: superado.
   - Ejemplo 2: Cálculo de coordenadas relativas de los pines. Se verificó
     que, al hacer clic en la posición (200, 150) dentro de un contenedor
     de 800x600 píxeles, las coordenadas almacenadas son (25%, 25%),
     garantizando que los pines se reposicionan correctamente al cambiar
     el tamaño de la ventana. Resultado: superado tras corregir un error
     de redondeo en la división.

2. Pruebas Funcionales: Verificación de los flujos de usuario completos
utilizando Postman para la API REST. Ejemplos:
   - Ejemplo 1: Flujo de auditoría por URL. Se introdujo una URL válida
     (https://example.com), el backend ejecutó Puppeteer correctamente,
     la captura se envió a Gemini y se obtuvo un JSON con puntuación y
     sugerencias. Resultado: superado.
   - Ejemplo 2: Usuario introduce una URL inválida (protocolo no
     soportado, como "ftp://archivo.com"). El sistema detectó el error en
     la validación del controlador y devolvió un código 400 con el mensaje
     "URL no válida o no accesible", sin llegar a ejecutar Puppeteer.
     Resultado: superado.
   - Ejemplo 3: IA devuelve error de análisis. Se subió una imagen
     completamente borrosa (ilegible). Gemini no pudo extraer
     información de accesibilidad y devolvió un error. El controlador
     capturó la excepción y devolvió un código 422 con el mensaje "No se
     pudo analizar la imagen proporcionada", sin interrumpir el
     funcionamiento del servidor. Resultado: superado.
   - Ejemplo 4: Registro con contraseña débil. Se intentó crear un usuario
     con contraseña "123". El sistema rechazó la petición con código 400
     indicando los criterios mínimos (8 caracteres, una mayúscula, una
     minúscula, un número). Resultado: superado.

3. Pruebas de Integración: Comprobación de la sincronización entre
servicios. Ejemplos:
   - Ejemplo 1: Un usuario coloca un pin en un proyecto. Se verificó que
     el pin se almacena correctamente en MongoDB y que el evento
     new_pin se emite a través de Socket.IO a todos los clientes conectados
     a la sala del proyecto en menos de 500 ms. Resultado: superado en
     red local, con latencia media de 120 ms.
   - Ejemplo 2: Un usuario da like a un proyecto. Se verificó que el array
     de likes en MongoDB se actualiza atómicamente (toggle) y que el
     frontend refleja el cambio de estado de forma optimista, revirtiendo
     en caso de error de red. Resultado: superado.

4. Pruebas Manuales: Pruebas de aceptación de usuario realizadas en
diferentes dispositivos y navegadores para verificar la responsividad y la
usabilidad. Ejemplos:
   - Verificación del diseño responsive en 3 dispositivos: monitor 1920x1080
     (escritorio), tableta iPad Air (820x1180) y móvil iPhone 12 (390x844).
     Se comprobó que el dashboard se adapta correctamente, la barra de
     navegación colapsa en menú hamburguesa y los pines mantienen su
     posición relativa. Resultado: superado.
   - Prueba del "Motor de Empatía": Se aplicaron los 5 filtros visuales
     (protanopía, deuteranopía, tritanopía, acromatopsía, desenfoque)
     sobre una captura de proyecto y se verificó visualmente que la
     simulación es coherente con las matrices de color documentadas en
     la literatura científica sobre daltonismo. Resultado: superado.
   - Prueba de accesibilidad de la propia plataforma: Se activó el sistema
     TTS y se navegó por las páginas principales verificando que los
     elementos con data-speech se leen en español al hacer hover/focus.
     Resultado: superado, aunque se detectó que el volumen por defecto
     era demasiado alto, por lo que se ajustó al 70%.

3.4.5 Herramientas utilizadas
Se han empleado las siguientes herramientas para cubrir todos los ángulos de la
aplicación:

• Postman: Utilizado para el testeo sistemático de la API REST. Se creó una
colección con todas las rutas organizadas por dominio (auth, projects, pins,
messages, admin), incluyendo variables de entorno para el token JWT y el
ID de proyecto. Esto permitió validar los códigos de respuesta HTTP, el
formato JSON y los mensajes de error de forma automatizada tras cada
cambio en el backend.

• Selenium WebDriver: Seleccionado para las pruebas End-to-End de flujos
críticos. Se eligió Selenium frente a alternativas modernas como Playwright
o Cypress por su madurez y su soporte para múltiples navegadores
(Chrome, Firefox, Edge), lo cual era relevante para verificar la
compatibilidad cruzada del "Motor de Empatía". Si bien Playwright ofrece
mejor rendimiento y Cypress una experiencia de desarrollo más fluida,
Selenium permitió validar los filtros SVG en navegadores basados en
diferentes motores de renderizado (Blink, Gecko), detectando una
diferencia sutil en la saturación del filtro de tritanopía entre Chrome y
Firefox que fue corregida ajustando la matriz de color.

• tsx: Empleado para la ejecución de scripts de verificación de lógica de
servidor de forma independiente, sin necesidad de levantar el servidor
Express completo. Se utilizó en lugar de frameworks de testing como Jest o
Vitest porque, en el contexto de este proyecto, el objetivo era validar
rápidamente funciones aisladas (hashing, coordenadas, cálculo de
promedios) durante el desarrollo, sin la sobrecarga de configuración que
implica un framework completo. La ejecución con tsx permitió correr
scripts TypeScript directamente, aprovechando la misma configuración de
tsconfig.json del proyecto.

3.4.6 Ciclo de ejecución y resultados
El ciclo de pruebas ha sido iterativo. Tras la detección de cualquier error, se ha
procedido a su corrección y a una posterior prueba de regresión para asegurar que
la solución no afectase a otras funcionalidades existentes.

A continuación, se presenta el plan de pruebas funcionales ejecutado:

[IMAGEN - Tabla del plan de pruebas funcionales con el ciclo de ejecución:
columnas para ID de prueba, módulo, descripción del caso, resultado esperado,
resultado obtenido, estado (superado/fallido) y observaciones.]

Resultados globales obtenidos durante el ciclo de pruebas:

• Total de casos de prueba ejecutados: 28 (3 de repetición).
• Casos superados: 26 (92,8%).
• Casos fallidos detectados y corregidos: 2
  1. Error de redondeo en el cálculo de coordenadas relativas de pines
     (corregido en Sprint 5).
  2. Diferencia de saturación en el filtro de tritanopía entre Chrome y
     Firefox (corregido en Sprint 4 mediante ajuste de la matriz de color).
• Incidencias de usabilidad detectadas y corregidas: 1 (volumen por defecto
  del TTS ajustado al 70%).

Las pruebas manuales confirmaron la correcta responsividad de la interfaz en
dispositivos móviles y la efectividad de los filtros de simulación sensorial. Las
pruebas de integración verificaron que la latencia en la comunicación WebSocket
se mantiene por debajo de 500 ms en red local, cumpliendo el requisito no
funcional de rendimiento establecido en el alcance.


CAPÍTULO 4. CONCLUSIONES Y TRABAJOS FUTUROS

1. CONCLUSIONES
El desarrollo de Axio ha permitido alcanzar los objetivos planteados al inicio del
proyecto:

En primer lugar, se ha diseñado y desarrollado una aplicación web Full-Stack
funcional que permite la gestión integral y colaborativa de proyectos digitales,
integrando en un único entorno capacidades de auditoría de accesibilidad,
simulación sensorial y colaboración en tiempo real. La plataforma cubre el ciclo
completo desde la subida de un proyecto hasta su publicación y revisión por la
comunidad.

En cuanto a los objetivos específicos, se ha utilizado TypeScript como lenguaje
transversal en frontend y backend, garantizando la consistencia de tipos y
reduciendo errores en tiempo de ejecución. Se ha implementado una arquitectura
basada en contenedores Docker, desplegada exitosamente sobre una Raspberry Pi 5,
lo que demuestra la viabilidad del Edge Computing para aplicaciones web de este
tipo con recursos hardware limitados.

La integración de la API de Google Gemini 2.5 Flash ha demostrado ser efectiva
para el análisis multimodal de accesibilidad, siendo capaz de procesar imágenes,
PDFs, código fuente y capturas de páginas web, generando informes estructurados
con puntuaciones y sugerencias accionables.

El sistema de comunicación en tiempo real mediante WebSockets (Socket.IO) ha
permitido implementar un modelo de colaboración síncrona con anotaciones
posicionales (pines) y chat integrado, funcionando correctamente incluso tras
túneles Cloudflare gracias al fallback a HTTP long-polling.

Los filtros de simulación de patologías visuales implementados en el frontend
(protanopía, deuteranopía, tritanopía, acromatopsía y desenfoque) constituyen un
motor de empatía que permite a los desarrolladores experimentar de primera mano
las barreras que enfrentan los usuarios con discapacidad visual.

Como conclusión principal, el proyecto ha demostrado que es técnicamente viable
integrar inteligencia artificial multimodal, colaboración en tiempo real y simulación
sensorial en una única plataforma de auditoría de accesibilidad, ofreciendo una
herramienta que puede contribuir a la construcción de un internet más inclusivo.

2. TRABAJOS FUTUROS
A partir de la base establecida por este proyecto, se identifican las siguientes líneas
de trabajo futuro:

• Implementación de testing automatizado: Desarrollo de una suite de tests
unitarios (Jest/Vitest) y de integración (Supertest) para garantizar la
estabilidad del código ante futuras ampliaciones.

• Pasarela de pago y modelo SaaS: Incorporación de un sistema de
suscripciones que permita monetizar la plataforma, con planes gratuitos y
premium que ofrezcan funcionalidades adicionales (más proyectos, análisis
avanzados, exportaciones).

• Integración con lectores de pantalla externos: Mejorar la compatibilidad
con software de accesibilidad como JAWS y NVDA, complementando el
sistema TTS integrado con una experiencia optimizada para estos lectores.

• Soporte multilingüe: Adaptación de la interfaz y los reportes de auditoría a
múltiples idiomas (inglés, francés, alemán), ampliando el alcance de la
plataforma a nivel internacional.

• Ampliación del motor de IA: Incorporación de otros modelos de IA (OpenAI
GPT-4 Vision, Claude) para ofrecer auditorías comparativas y mejorar la
precisión del análisis.

• Automatización de correcciones: Desarrollo de un módulo que no solo
detecte problemas de accesibilidad, sino que genere automáticamente las
correcciones de código necesarias (por ejemplo, añadir atributos alt a
imágenes, mejorar contrastes de color).

• Aplicación móvil nativa: Desarrollo de versiones para iOS y Android que
permitan realizar auditorías rápidas desde dispositivos móviles, incluyendo
la captura de fotos de interfaces físicas (carteles, señalización) para su
análisis de accesibilidad.

• Integración CI/CD: Configuración de pipelines de integración y despliegue
continuo mediante GitHub Actions, automatizando las pruebas y el despliegue
en la Raspberry Pi.

• Mejora del sistema de notificaciones: Integración con servicios de correo
electrónico (SendGrid, Resend) para notificaciones por email, aprovechando
los webhooks ya configurados en n8n.

• Análisis de contenido multimedia: Ampliación del motor de auditoría para
procesar vídeos y animaciones, evaluando la accesibilidad de contenido
dinámico y multimedia.


CAPÍTULO 5. REFERENCIAS BIBLIOGRÁFICAS

Normativa Legal y Estándares.
Parlamento Europeo y Consejo de la Unión Europea. (2019, 17 de abril).
Directiva (UE) 2019/882 del Parlamento Europeo y del Consejo, sobre los
requisitos de accesibilidad de los productos y servicios. Diario Oficial de la Unión
Europea. Recuperado el 28 de noviembre de 2025, de https://eur-
lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32019L0882

W3C Web Accessibility Initiative (WAI). (2018). Web Content Accessibility
Guidelines (WCAG) 2.1. World Wide Web Consortium. Recuperado el 28 de
noviembre de 2025, de https://www.w3.org/TR/WCAG21/

Mozilla Developer Network. (s. f.). Accessibility. MDN Web Docs. Recuperado
el 28 de noviembre de 2025, de https://developer.mozilla.org/en-
US/docs/Web/Accessibility

Metodologías y Conceptos.
Schwaber, K., & Sutherland, J. (2020, noviembre). La Guía de Scrum. Scrum.org.
Recuperado el 28 de noviembre de 2025, de
https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Spanish-
European.pdf

Abstracta. (s. f.). Shift left testing: Turn quality into a growth engine. Abstracta.
Recuperado el 28 de noviembre de 2025, de
https://abstracta.us/blog/devops/shift-left-testing/

Tecnologías y Frameworks.
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


CAPÍTULO 6. ANEXOS

Anexo I: Diagramas del sistema
Se incluyen como anexo los siguientes diagramas referenciados a lo largo del
documento:
- Diagrama 1: Arquitectura de contenedores Docker.
- Diagrama 2: Patrón MVC en el backend.
- Diagrama 3: Flujo de comunicación WebSocket.
- Diagrama 4: Diagrama de casos de uso.
- Diagrama 5: Diagrama Entidad-Relación (modelo de datos).
- Diagrama 6: Esquema detallado del modelo User.
- Diagrama 7: Esquema detallado del modelo Audit.
- Diagrama 8: Mapa de navegación de la SPA.

Anexo II: Código fuente
El código fuente completo del proyecto está disponible en el repositorio de GitHub
asociado a este trabajo.

Anexo III: Archivo docker-compose.yml
Se adjunta el archivo de orquestación de contenedores utilizado para el despliegue
de la infraestructura en la Raspberry Pi 5.

Anexo IV: Manual de usuario
Guía de uso de la plataforma Axio con capturas de pantalla de las principales
funcionalidades: registro, subida de proyectos, análisis con IA, aplicación de
filtros sensoriales, colocación de pines colaborativos y publicación en la comunidad.


Anexo V: Endpoints de la API REST
A continuación se listan todos los endpoints implementados en las 9 rutas del
backend. Todas las rutas salvo las indicadas requieren el token JWT en la cabecera
Authorization: Bearer <token>.

=== Auth (/api/auth) ===
POST   /api/auth/register          - Registro (rate limit: 10/15min)
POST   /api/auth/login             - Login (rate limit: 10/15min)
POST   /api/auth/forgot-password   - Solicitar reset password (rate limit: 5/15min)
POST   /api/auth/reset-password/:token - Resetear password con token
PUT    /api/auth/profile           - Actualizar perfil (username, bio) [JWT]
PUT    /api/auth/password          - Cambiar contraseña [JWT]
DELETE /api/auth/me                - Eliminar cuenta [JWT]
POST   /api/auth/avatar            - Subir avatar (multipart) [JWT]

=== Analyze (/api/analyze) ===
POST   /api/analyze                - Analizar archivo (imagen/PDF/código) [JWT + Multer]
POST   /api/analyze/url            - Analizar URL [JWT]

=== Projects (/api/projects) ===
GET    /api/projects               - Mis proyectos [JWT]
GET    /api/projects/community     - Proyectos públicos de la comunidad [JWT]
GET    /api/projects/:id           - Ver proyecto individual [JWT]
POST   /api/projects               - Crear proyecto (con/sin archivo) [JWT + Multer]
DELETE /api/projects/:id           - Eliminar proyecto (solo owner) [JWT]
PUT    /api/projects/:id/like      - Toggle like [JWT]
PUT    /api/projects/:id/rate      - Votar 1-5 estrellas [JWT]

=== Pins (/api/pins) ===
GET    /api/pins/:projectId        - Pines de un proyecto [JWT]
POST   /api/pins                   - Crear pin (x, y, content) [JWT]
DELETE /api/pins/:pinId            - Eliminar pin (autor o dueño) [JWT]

=== Users (/api/users) ===
GET    /api/users/:username        - Perfil público por username
GET    /api/users/id/:id           - Perfil público por ID

=== Messages (/api/messages) ===
GET    /api/messages/conversations     - Listar conversaciones [JWT]
POST   /api/messages/conversations     - Obtener/crear conversación [JWT]
GET    /api/messages/:conversationId   - Mensajes de una conversación [JWT]
POST   /api/messages/:conversationId   - Enviar mensaje (texto/imagen) [JWT + Multer]
POST   /api/messages/:conversationId/read - Marcar leída [JWT]
DELETE /api/messages/:conversationId   - Eliminar conversación [JWT]

=== Notifications (/api/notifications) ===
GET    /api/notifications          - Listar notificaciones (top 100) [JWT]
POST   /api/notifications/read-all - Marcar todas leídas [JWT]
POST   /api/notifications/:id/read - Marcar una leída [JWT]

=== Stats (/api/stats) ===
GET    /api/stats/weekly           - Estadísticas semanales (pública)

=== Admin (/api/admin) ===
[Todas requieren JWT + rol admin]
GET    /api/admin/users            - Listar usuarios
GET    /api/admin/users/:id        - Ver usuario
POST   /api/admin/users            - Crear usuario
PUT    /api/admin/users/:id        - Editar usuario
PUT    /api/admin/users/:id/suspend   - Suspender usuario
PUT    /api/admin/users/:id/unsuspend - Reactivar usuario
POST   /api/admin/users/:id/reset-password - Resetear contraseña
DELETE /api/admin/users/:id        - Eliminar usuario
GET    /api/admin/projects         - Listar proyectos
GET    /api/admin/projects/:id     - Ver proyecto
PUT    /api/admin/projects/:id     - Editar proyecto
DELETE /api/admin/projects/:id     - Eliminar proyecto
GET    /api/admin/audits           - Listar auditorías
GET    /api/admin/audits/export    - Exportar auditorías CSV
DELETE /api/admin/audits/:id       - Eliminar auditoría
GET    /api/admin/pins             - Listar pines
PUT    /api/admin/pins/:id/visibility - Cambiar visibilidad
DELETE /api/admin/pins/:id         - Eliminar pin
GET    /api/admin/stats            - Estadísticas de admin
GET    /api/admin/activity         - Activity log
GET    /api/admin/config           - Ver configuración global
PUT    /api/admin/config           - Editar configuración global

Total: 44 endpoints

Anexo VI: Árbol de directorios del proyecto

server/src/
  app.ts                          - Punto de entrada (Express + Socket.IO + MongoDB)
  seed.ts                         - Utilidad de diagnóstico de BD
  controllers/
    adminController.ts            - CRUD admin (usuarios, proyectos, auditorías, pines, config)
    analyzeController.ts          - Análisis con IA (Gemini) + webhooks n8n
    authController.ts             - Registro, login, perfil, password, avatar
    messageController.ts          - Mensajería directa (DMs)
    notificationController.ts     - Notificaciones push
    pinController.ts              - Pines colaborativos + webhooks n8n
    projectController.ts          - CRUD proyectos, likes, votaciones
    statsController.ts            - Estadísticas semanales
    userController.ts             - Perfil público + insignias
  middlewares/
    auth.ts                       - protect (JWT), requireAdmin, requirePermission
    upload.ts                     - Multer (filtros MIME, límite 10MB)
    rateLimit.ts                  - Rate limiting en memoria (Map)
  models/
    Admin.ts                      - Permisos admin + activity log
    Audit.ts                      - Resultados de auditoría IA (score, issues)
    Conversation.ts               - Conversación entre 2 usuarios
    Message.ts                    - Mensaje individual (texto/imagen)
    Notification.ts               - Notificación push
    Pin.ts                        - Anotación posicional (x, y, content)
    Project.ts                    - Proyecto (título, tipo, likes, ratings)
    SiteConfig.ts                 - Configuración global (singleton)
    User.ts                       - Usuario (username, email, password, role, suspension)
  routes/
    adminRoutes.ts                - /api/admin/*
    analyzeRoutes.ts              - /api/analyze/*
    authRoutes.ts                 - /api/auth/*
    messageRoutes.ts              - /api/messages/*
    notificationRoutes.ts         - /api/notifications/*
    pinRoutes.ts                  - /api/pins/*
    projectRoutes.ts              - /api/projects/*
    statsRoutes.ts                - /api/stats/*
    userRoutes.ts                 - /api/users/*
  scripts/
    createFirstAdmin.ts           - Convertir usuario a admin
    migrateAdmins.ts              - Migrar admins a tabla Admin
  services/
    webScraper.ts                 - Puppeteer (captura URLs, auto-detección ARM)
  utils/
    badges.ts                     - Lógica de insignias (gamificación)
    jwt.ts                        - Obtener JWT_SECRET del entorno
    siteConfig.ts                 - Obtener/crear config global del sitio
    socket.ts                     - Singleton de Socket.IO

client/src/
  main.tsx                        - Punto de entrada React
  App.tsx                         - Router + rutas protegidas
  index.css                       - Tailwind + estilos base
  assets/
    badges/                       - 5 imágenes de insignias
    logo.png
  components/
    accessibility/A11yProvider.tsx - Texto a voz (Web Speech API)
    collaboration/PinLayer.tsx    - Canvas para pines colaborativos
  context/
    AuthContext.tsx                - Estado de autenticación global
    SocketContext.tsx              - Conexión Socket.IO global
    ThemeContext.tsx               - Tema claro/oscuro
  pages/
    Admin.tsx                      - Panel de administración
    Dashboard.tsx                  - Contenedor principal con pestañas
    Explore.tsx                    - Comunidad/Explorar proyectos
    ForgotPassword.tsx             - Solicitar reset de password
    Home.tsx                       - Landing page pública
    Login.tsx                      - Login
    Messages.tsx                   - Chat directo (DMs)
    MyProjects.tsx                 - Mis proyectos
    Profile.tsx                    - Perfil público de usuario
    ProjectView.tsx                - Visor de proyecto + filtros + pines
    Register.tsx                   - Registro
    ResetPassword.tsx              - Resetear password con token
    Settings.tsx                   - Configuración de cuenta
  services/
    adminService.ts                - Servicios para panel admin
    api.ts                         - Instancia Axios + interceptor JWT
  types/
    assets.d.ts                    - Declaraciones de tipos para assets

