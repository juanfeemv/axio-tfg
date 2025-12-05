import dotenv from 'dotenv';
dotenv.config();

console.log("--- INICIO DIAGNÓSTICO ---");

const apiKey = process.env.GEMINI_API_KEY;

// 1. Verificamos si hay clave
if (!apiKey) {
    console.error("❌ ERROR FATAL: No se ha leído ninguna GEMINI_API_KEY del archivo .env");
    process.exit(1);
}

console.log(`✅ Clave detectada: ${apiKey.substring(0, 8)}...`);
console.log("📡 Contactando con los servidores de Google...");

// 2. Hacemos la petición manual (sin librería) para ver qué pasa
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
        console.error("\n❌ GOOGLE HA RECHAZADO TU CLAVE:");
        console.error(`   Código: ${data.error.code}`);
        console.error(`   Mensaje: ${data.error.message}`);
        console.error("👉 SOLUCIÓN: Tu clave está mal copiada o caducada. Genera una nueva en AI Studio.");
    } else {
        console.log("\n🎉 ¡CONEXIÓN EXITOSA! Tienes acceso a estos modelos:");
        const modelosUtiles = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', ''));
        
        console.log(modelosUtiles);
        console.log("\n👉 COPIA UNO DE ESOS NOMBRES en tu analyzeController.ts");
    }
  })
  .catch(err => {
    console.error("\n❌ ERROR DE RED O CONEXIÓN:");
    console.error(err);
  });