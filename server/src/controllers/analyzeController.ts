import { Request, Response } from 'express';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import Audit from '../models/Audit';
import { captureWebsite } from '../services/webScraper'; // Importamos el scraper

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- FUNCIÓN REUTILIZABLE: Preguntar a Gemini ---
// Esto evita repetir código. Le das una imagen (base64) y te devuelve el análisis.
const askGemini = async (imageBase64: string, mimeType: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    Actúa como auditor experto WCAG 2.1.
    Analiza esta interfaz.
    Responde SOLO con JSON válido:
    {
      "score": 0-100,
      "issues": [
        { "element": "nombre", "problem": "descripción", "suggestion": "solución", "severity": "high/medium/low" }
      ]
    }
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBase64, mimeType: mimeType } }
  ]);

  const text = result.response.text();
  const cleanJson = text.replace(/```json|```/g, '').trim();
  
  try {
    return { json: JSON.parse(cleanJson), raw: text };
  } catch (e) {
    return { json: { score: 0, issues: [] }, raw: text };
  }
};

// --- RUTA A: Analizar Imagen Subida ---
export const analyzeImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Falta imagen' });

    const imagePath = req.file.path;
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');

    // 1. Llamamos a la función común
    const { json, raw } = await askGemini(imageBase64, req.file.mimetype);

    // 2. Guardamos en BD
    const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw });
    await newAudit.save();

    // 3. Limpieza
    try { fs.unlinkSync(imagePath); } catch(e) {}

    res.json({ success: true, data: json, savedId: newAudit._id });

  } catch (error: any) {
    res.status(500).json({ message: 'Error analizando imagen', error: error.message });
  }
};

// --- RUTA B: Analizar URL (NUEVA) ---
export const analyzeUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'Falta la URL' });

    console.log(`🌍 Visitando URL: ${url}`);

    // 1. Usar Puppeteer para sacar la foto
    const { imageBase64, pageTitle } = await captureWebsite(url);

    // 2. Llamamos a Gemini con esa foto
    // Puppeteer saca PNG por defecto
    const { json, raw } = await askGemini(imageBase64, 'image/png');

    // 3. Guardamos en BD
    const newAudit = new Audit({ 
      score: json.score, 
      issues: json.issues, 
      rawResponse: raw,
      // Podríamos guardar el título o la URL en el modelo Audit si lo actualizamos luego
    });
    await newAudit.save();

    console.log(`✅ Web analizada: ${pageTitle}`);

    res.json({ success: true, data: json, savedId: newAudit._id });

  } catch (error: any) {
    console.error("❌ Error URL:", error);
    res.status(500).json({ message: 'Error analizando la web', error: error.message });
  }
};