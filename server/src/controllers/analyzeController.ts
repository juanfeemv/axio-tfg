import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Audit from '../models/Audit';
import Project from '../models/Project';
import { captureWebsite } from '../services/webScraper';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.error("❌ FATAL: No hay API Key");

const genAI = new GoogleGenerativeAI(apiKey || "");

// --- HELPER: Obtener Usuario ---
const getUserIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'palabrasecretaparaeltoken';
      const decoded: any = jwt.verify(token, secret);
      return decoded.id;
    } catch (e) { return null; }
  }
  return null;
};

// --- HELPER 1: Análisis VISUAL (Imágenes/PDF) ---
const analyzeVisual = async (imageBase64: string, mimeType: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    Actúa como un auditor experto en Accesibilidad Web (WCAG 2.1) y Diseño UI/UX.
    Analiza esta interfaz visualmente. Detecta problemas de contraste, tamaño de texto y distribución.
    
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
    return { json: { score: 0, issues: [] }, raw: "" };
  }
};

// --- HELPER 2: Análisis de CÓDIGO (Texto) ---
const analyzeCode = async (codeContent: string, filename: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    Actúa como un auditor experto en Accesibilidad Web (WCAG 2.1) y Código Limpio.
    Analiza este archivo de código fuente: "${filename}".
    Busca errores de: HTML semántico, etiquetas ARIA faltantes, falta de alt en imágenes, estructura incorrecta.
    
    CÓDIGO A ANALIZAR:
    \`\`\`
    ${codeContent}
    \`\`\`

    Responde SOLO con JSON válido con esta estructura:
    {
      "score": 0-100,
      "issues": [
        { "element": "linea o etiqueta", "problem": "explicación técnica", "suggestion": "código corregido", "severity": "high/medium/low" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return { json: JSON.parse(cleanJson), raw: text };
  } catch (e) {
    return { json: { score: 0, issues: [] }, raw: "" };
  }
};

// --- CONTROLADOR PRINCIPAL (Archivos) ---
export const analyzeImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Falta archivo' });

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();
    
    console.log(`📸 Analizando archivo: ${req.file.originalname} (${mimeType})`);

    let resultIA;
    let projectType: 'file' | 'code' = 'file';

    // 1. DETECTAR SI ES CÓDIGO
    const isCode = 
      mimeType.includes('text') || 
      mimeType.includes('javascript') || 
      mimeType.includes('json') ||
      originalName.endsWith('.ts') || 
      originalName.endsWith('.tsx') ||
      originalName.endsWith('.jsx') ||
      originalName.endsWith('.html') ||
      originalName.endsWith('.css');

    if (isCode) {
      // MODO CÓDIGO: Leemos como texto (UTF-8)
      console.log("📝 Modo Análisis de Código activado");
      projectType = 'code';
      const codeContent = fs.readFileSync(filePath, 'utf-8');
      resultIA = await analyzeCode(codeContent, req.file.originalname);
    } else {
      // MODO VISUAL: Leemos como imagen (Base64)
      console.log("👁️ Modo Análisis Visual activado");
      projectType = 'file';
      const fileBuffer = fs.readFileSync(filePath);
      const imageBase64 = fileBuffer.toString('base64');
      resultIA = await analyzeVisual(imageBase64, mimeType);
    }

    const { json, raw } = resultIA;

    // 2. Guardar en BD
    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
      const newProject = new Project({
        title: req.file.originalname,
        owner: userId,
        type: projectType, // Guardamos si fue 'code' o 'file'
        input: req.file.filename,
        status: 'analyzed',
        accessibilityScore: json.score
      });
      await newProject.save();
      savedProjectId = newProject._id;

      const newAudit = new Audit({ 
        score: json.score, 
        issues: json.issues, 
        rawResponse: raw,
        project: savedProjectId 
      });
      await newAudit.save();
      console.log(`✅ Proyecto (${projectType}) guardado: ${newProject.title}`);
    } else {
       const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw });
       await newAudit.save();
    }

    // 3. Limpieza
    try { fs.unlinkSync(filePath); } catch(e) {}

    res.json({ success: true, data: json, savedId: savedProjectId });

  } catch (error: any) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: 'Error analizando archivo', error: error.message });
  }
};

// --- CONTROLADOR URL (Sin cambios mayores, usa el helper visual) ---
export const analyzeUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'Falta la URL' });

    console.log(`🌍 Visitando URL: ${url}`);
    const { imageBase64, pageTitle } = await captureWebsite(url);
    
    // Reutilizamos el helper visual
    const { json, raw } = await analyzeVisual(imageBase64, 'image/png');

    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
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

      const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw, project: savedProjectId });
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