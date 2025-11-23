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
