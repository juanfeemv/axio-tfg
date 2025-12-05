import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    console.log("🔍 Buscando modelos disponibles para tu API Key...");
    
    // Este truco a veces es necesario si no hay método directo expuesto fácil en todas las versiones
    
    console.log("------------------------------------------------");
    console.log("⚠️ Si este script falla, tu API KEY no es válida.");
    console.log("------------------------------------------------");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Opción más directa para listar (si la versión de la librería lo permite)
console.log("Tu clave es:", process.env.GEMINI_API_KEY ? "Detectada ✅" : "No detectada ❌");