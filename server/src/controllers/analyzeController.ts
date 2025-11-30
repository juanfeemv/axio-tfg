import { Request, Response } from 'express';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Audit from '../models/Audit';
import Project from '../models/Project'; // <--- Importamos el modelo Project
import { captureWebsite } from '../services/webScraper';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- HELPER: Obtener ID del usuario desde el Token ---
// Esto nos permite saber quién está haciendo el análisis para guardárselo
const getUserIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      // Usamos la misma clave secreta que en authController
      const secret = process.env.JWT_SECRET || 'palabrasecretaparaeltoken';
      const decoded: any = jwt.verify(token, secret);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// --- FUNCIÓN REUTILIZABLE: Preguntar a Gemini ---
const askGemini = async (imageBase64: string, mimeType: string) => {
  // Usamos el modelo que te funcionó en el diagnóstico
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

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: mimeType } }
    ]);

    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    
    return { json: JSON.parse(cleanJson), raw: text };
  } catch (e) {
    console.error("Error IA:", e);
    // Devuelve un objeto vacío seguro si falla
    return { json: { score: 0, issues: [] }, raw: "" };
  }
};

// --- RUTA A: Analizar Imagen Subida ---
export const analyzeImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Falta imagen' });

    const imagePath = req.file.path;
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');

    console.log(`📸 Analizando archivo: ${req.file.originalname}`);

    // 1. Llamamos a la IA
    const { json, raw } = await askGemini(imageBase64, req.file.mimetype);

    // 2. Lógica de Guardado (Proyecto + Auditoría)
    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
      // A) Crear el Proyecto
      const newProject = new Project({
        title: req.file.originalname, // Usamos el nombre del archivo como título
        owner: userId,
        type: 'file',
        input: req.file.filename, // Guardamos la referencia
        status: 'analyzed',
        accessibilityScore: json.score
      });
      await newProject.save();
      savedProjectId = newProject._id;

      // B) Crear la Auditoría vinculada
      const newAudit = new Audit({ 
        score: json.score, 
        issues: json.issues, 
        rawResponse: raw,
        project: savedProjectId // <--- Vinculación clave
      });
      await newAudit.save();
    } else {
      // Si no hay usuario (ej: prueba sin login), guardamos solo la auditoría suelta
      const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw });
      await newAudit.save();
    }

    // 3. Limpieza
    try { fs.unlinkSync(imagePath); } catch(e) {}

    res.json({ success: true, data: json, savedId: savedProjectId });

  } catch (error: any) {
    res.status(500).json({ message: 'Error analizando imagen', error: error.message });
  }
};

// --- RUTA B: Analizar URL ---
export const analyzeUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'Falta la URL' });

    console.log(`🌍 Visitando URL: ${url}`);

    // 1. Usar Puppeteer
    const { imageBase64, pageTitle } = await captureWebsite(url);

    // 2. Usar IA
    const { json, raw } = await askGemini(imageBase64, 'image/png');

    // 3. Lógica de Guardado (Proyecto + Auditoría)
    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
      // A) Crear el Proyecto
      const newProject = new Project({
        title: pageTitle || url,
        owner: userId,
        type: 'url',
        input: url,
        status: 'analyzed',
        accessibilityScore: json.score
      });
      await newProject.save();
      savedProjectId = newProject._id;

      // B) Crear la Auditoría vinculada
      const newAudit = new Audit({ 
        score: json.score, 
        issues: json.issues, 
        rawResponse: raw,
        project: savedProjectId 
      });
      await newAudit.save();
      
      console.log(`✅ Proyecto guardado: ${newProject.title}`);
    } else {
       const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw });
       await newAudit.save();
    }

    res.json({ success: true, data: json, savedId: savedProjectId });

  } catch (error: any) {
    console.error("❌ Error URL:", error);
    res.status(500).json({ message: 'Error analizando la web', error: error.message });
  }
};