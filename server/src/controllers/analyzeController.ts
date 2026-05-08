import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Audit from '../models/Audit.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { captureWebsite } from '../services/webScraper.js';
import { getJwtSecret } from '../utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.error("❌ FATAL: No hay API Key en el .env"); //Comprobación si hay API Key

const genAI = new GoogleGenerativeAI(apiKey || "");

const getUserIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const secret = getJwtSecret();
      const decoded: any = jwt.verify(token, secret);
      return decoded.id;
    } catch (e) { return null; }
  }
  return null;
};

const notifyN8n = async (project: any, userId: string) => {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      console.warn('⚠️ N8N_WEBHOOK_URL no configurado. Se omite la notificación.');
      return;
    }
    
    const userInfo = await User.findById(userId).select('username email');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        projectId: project._id,
        title: project.title,
        type: project.type,
        url: project.input,
        owner: userId,
        ownerName: userInfo?.username || userInfo?.email || 'Usuario Anónimo',
        createdAt: project.createdAt,
        hasAI: true,
        score: project.accessibilityScore
      })
    });

    clearTimeout(timeoutId);
    
    console.log('✅ Webhook n8n notificado (con IA)');
  } catch (webhookError) {
    console.error('❌ Error al notificar n8n:', webhookError);
  }
};

{/* PROMPTS PARA LA IA*/}
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

const analyzeCode = async (codeContent: string, filename: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
    Actúa como un auditor experto en Accesibilidad Web (WCAG 2.1) y Código Limpio.
    Analiza este archivo de código fuente: "${filename}".
    Busca errores de: HTML semántico, etiquetas ARIA faltantes, falta de alt en imágenes.
    
    CÓDIGO:
    \`\`\`
    ${codeContent}
    \`\`\`

    Responde SOLO con JSON válido:
    {
      "score": 0-100,
      "issues": [
        { "element": "linea", "problem": "explicación", "suggestion": "corrección", "severity": "high/medium/low" }
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

export const analyzeImage = async (req: Request, res: Response) => { // Analizo la imagen con su carga
  try {
    if (!req.file) return res.status(400).json({ message: 'Falta archivo' });

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();
    
    console.log(`📸 Analizando archivo: ${req.file.originalname}`);

    let resultIA;
    let projectType: 'file' | 'code' = 'file';

    const isCode = 
      mimeType.includes('text') || 
      mimeType.includes('javascript') || 
      mimeType.includes('json') ||
      originalName.endsWith('.html') || originalName.endsWith('.css') ||
      originalName.endsWith('.js') || originalName.endsWith('.ts') || 
      originalName.endsWith('.tsx') || originalName.endsWith('.jsx');

    if (isCode) {
      projectType = 'code';
      const codeContent = fs.readFileSync(filePath, 'utf-8');
      resultIA = await analyzeCode(codeContent, req.file.originalname);
    } else {
      projectType = 'file';
      const fileBuffer = fs.readFileSync(filePath);
      const imageBase64 = fileBuffer.toString('base64');
      resultIA = await analyzeVisual(imageBase64, mimeType);
    }

    const { json, raw } = resultIA;

    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
      const newProject = new Project({
        title: req.file.originalname,
        owner: userId,
        type: projectType,
        input: req.file.filename, 
        image: projectType === 'file' ? req.file.filename : undefined,
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
      
      console.log(`✅ Proyecto guardado: ${newProject.title}`);
      
      await notifyN8n(newProject, userId);
    } else {
       try { fs.unlinkSync(filePath); } catch(e) {}
    }

    res.json({ success: true, data: json, savedId: savedProjectId });

  } catch (error: any) {
    res.status(500).json({ message: 'Error procesando archivo', error: error.message });
  }
};

export const analyzeUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'Falta URL' });

    console.log(`🌍 Visitando URL: ${url}`);
    
    const { imageBase64, pageTitle } = await captureWebsite(url);
    const { json, raw } = await analyzeVisual(imageBase64, 'image/png');

    const userId = getUserIdFromToken(req);
    let savedProjectId = null;

    if (userId) {
      const filename = `url-${Date.now()}.png`;
      const uploadDir = path.join(__dirname, '../../uploads'); 
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
      fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(imageBase64, 'base64'));

      const newProject = new Project({
        title: pageTitle || url,
        owner: userId,
        type: 'url',
        input: url,
        image: filename,
        status: 'analyzed',
        accessibilityScore: json.score
      });
      await newProject.save();
      savedProjectId = newProject._id;

      const newAudit = new Audit({ score: json.score, issues: json.issues, rawResponse: raw, project: savedProjectId });
      await newAudit.save();
      
      console.log(`✅ URL guardada con captura: ${filename}`);
      
      await notifyN8n(newProject, userId);
    }

    res.json({ success: true, data: json, savedId: savedProjectId });

  } catch (error: any) {
    console.error("❌ Error URL:", error);
    res.status(500).json({ message: 'Error analizando web', error: error.message });
  }
};