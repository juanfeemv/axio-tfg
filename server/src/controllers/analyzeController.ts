import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Audit from '../models/Audit.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { captureWebsite, type WebsiteAuditContext } from '../services/webScraper.js';
import { getJwtSecret } from '../utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.error('❌ FATAL: No hay API Key en el .env');

const genAI = new GoogleGenerativeAI(apiKey || '');

const getUserIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const secret = getJwtSecret();
      const decoded: any = jwt.verify(token, secret);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }

  return null;
};

type AuditSeverity = 'high' | 'medium' | 'low';

type AuditIssue = {
  element: string;
  problem: string;
  suggestion: string;
  severity: AuditSeverity;
};

type AuditPayload = {
  score: number;
  issues: AuditIssue[];
};

const extractJsonPayload = (text: string) => {
  const withoutFences = text.replace(/```json|```/g, '').trim();
  const firstBrace = withoutFences.indexOf('{');
  const lastBrace = withoutFences.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return withoutFences.slice(firstBrace, lastBrace + 1);
  }

  return withoutFences;
};

const clampScore = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return 100;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const normalizeSeverity = (value: unknown): AuditSeverity => {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'medium';
};

const normalizeIssues = (issues: unknown): AuditIssue[] => {
  if (!Array.isArray(issues)) return [];

  return issues
    .map((issue) => {
      if (!issue || typeof issue !== 'object') return null;

      const candidate = issue as Partial<AuditIssue>;
      const element = typeof candidate.element === 'string' && candidate.element.trim() ? candidate.element.trim() : 'elemento';
      const problem = typeof candidate.problem === 'string' && candidate.problem.trim() ? candidate.problem.trim() : 'Problema de accesibilidad detectado';
      const suggestion = typeof candidate.suggestion === 'string' && candidate.suggestion.trim() ? candidate.suggestion.trim() : 'Revisar y corregir el patrón detectado';

      return {
        element,
        problem,
        suggestion,
        severity: normalizeSeverity(candidate.severity)
      };
    })
    .filter((issue): issue is AuditIssue => Boolean(issue));
};

const dedupeIssues = (issues: AuditIssue[]) => {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.element}|${issue.problem}|${issue.suggestion}|${issue.severity}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const severityPenalty = (severity: AuditSeverity) => {
  switch (severity) {
    case 'high':
      return 18;
    case 'medium':
      return 10;
    default:
      return 4;
  }
};

const normalizeAuditPayload = (payload: any, fallbackIssues: AuditIssue[] = []): AuditPayload => {
  const issues = dedupeIssues([...normalizeIssues(payload?.issues), ...fallbackIssues]);
  const baseScore = clampScore(payload?.score);
  const issuePenalty = issues.reduce((total, issue) => total + severityPenalty(issue.severity), 0);
  const strictScore = Math.max(0, Math.min(baseScore, 100 - issuePenalty));

  return {
    score: strictScore,
    issues
  };
};

const getSafeLineLabel = (codeContent: string, regex: RegExp) => {
  const lineIndex = codeContent.split('\n').findIndex((line) => regex.test(line));
  return lineIndex >= 0 ? `L${lineIndex + 1}` : 'archivo completo';
};

const buildCodeHeuristics = (codeContent: string): AuditIssue[] => {
  const issues: AuditIssue[] = [];

  const imgPattern = /<img\b(?![^>]*\balt\s*=)[^>]*>/i;
  const blankTargetPattern = /<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/i;
  const hasNoopener = /rel\s*=\s*["'][^"']*noopener/i.test(codeContent);
  const hasNoreferrer = /rel\s*=\s*["'][^"']*noreferrer/i.test(codeContent);

  if (imgPattern.test(codeContent)) {
    issues.push({
      element: getSafeLineLabel(codeContent, imgPattern),
      problem: 'Hay una imagen sin atributo alt descriptivo.',
      suggestion: 'Añade un alt breve y útil, o usa alt="" si la imagen es decorativa.',
      severity: 'high'
    });
  }

  if (blankTargetPattern.test(codeContent) && (!hasNoopener || !hasNoreferrer)) {
    issues.push({
      element: getSafeLineLabel(codeContent, blankTargetPattern),
      problem: 'Un enlace abre en nueva pestaña sin rel="noopener noreferrer".',
      suggestion: 'Añade rel="noopener noreferrer" a los enlaces con target="_blank".',
      severity: 'medium'
    });
  }

  return issues;
};

const buildVisualHeuristics = (context?: WebsiteAuditContext): AuditIssue[] => {
  if (!context) return [];

  const issues: AuditIssue[] = [];
  const { counts } = context;

  if (!context.lang) {
    issues.push({
      element: 'documento',
      problem: 'La página no declara el idioma principal del documento.',
      suggestion: 'Declara el atributo lang en el elemento html.',
      severity: 'medium'
    });
  }

  if (!context.hasViewportMeta) {
    issues.push({
      element: 'metadatos',
      problem: 'Falta la etiqueta viewport, lo que puede romper la adaptación móvil.',
      suggestion: 'Incluye meta name="viewport" para mejorar el comportamiento responsive.',
      severity: 'medium'
    });
  }

  if (counts.imagesWithoutAlt > 0) {
    issues.push({
      element: 'imágenes',
      problem: `Se detectaron ${counts.imagesWithoutAlt} imágenes sin texto alternativo.`,
      suggestion: 'Añade alt descriptivo a cada imagen informativa o alt vacío si es decorativa.',
      severity: 'high'
    });
  }

  if (counts.buttonsWithoutAccessibleName > 0) {
    issues.push({
      element: 'botones',
      problem: `Se detectaron ${counts.buttonsWithoutAccessibleName} botones sin nombre accesible visible o aria-label.`,
      suggestion: 'Añade texto visible o un aria-label descriptivo para cada control interactivo.',
      severity: 'high'
    });
  }

  if (counts.linksBlankWithoutRel > 0) {
    issues.push({
      element: 'enlaces',
      problem: `Se detectaron ${counts.linksBlankWithoutRel} enlaces con target="_blank" sin rel seguro completo.`,
      suggestion: 'Usa rel="noopener noreferrer" en los enlaces que abren una nueva pestaña.',
      severity: 'medium'
    });
  }

  if (counts.formFieldsWithoutLabel > 0) {
    issues.push({
      element: 'formularios',
      problem: `Se detectaron ${counts.formFieldsWithoutLabel} campos sin etiqueta asociada.`,
      suggestion: 'Asocia cada control con una etiqueta visible o con aria-label/aria-labelledby.',
      severity: 'high'
    });
  }

  if (context.headingStructure.length > 0 && !context.headingStructure.some((heading) => heading.startsWith('H1:'))) {
    issues.push({
      element: 'jerarquía de títulos',
      problem: 'Hay encabezados, pero no se detecta un H1 principal.',
      suggestion: 'Define una jerarquía clara de encabezados empezando por un H1 representativo.',
      severity: 'medium'
    });
  }

  if (counts.mainLandmarks === 0) {
    issues.push({
      element: 'estructura semántica',
      problem: 'No se detecta un landmark main en la página.',
      suggestion: 'Envuelve el contenido principal en un elemento main para mejorar la navegación asistiva.',
      severity: 'medium'
    });
  }

  return issues;
};

const buildVisualPrompt = (context?: WebsiteAuditContext) => `
Actúa como un auditor extremadamente estricto en Accesibilidad Web (WCAG 2.1) y UI/UX.
Tu tarea es detectar problemas reales, también menores, y no dar puntuaciones artificialmente altas.
Si encuentras cualquier indicio razonable de problema, inclúyelo como issue.

Revisa al menos estos frentes: contraste, jerarquía tipográfica, foco visible, navegación por teclado, etiquetas de formularios, texto alternativo, landmarks semánticos, orden lógico de títulos, tamaño de objetivo táctil, enlaces con nueva pestaña, color como único canal de información, densidad visual, responsive design y claridad de llamadas a la acción.

Contexto DOM disponible:
${context ? JSON.stringify(context, null, 2) : 'No disponible'}

Devuelve SOLO JSON válido con esta estructura:
{
  "score": 0-100,
  "issues": [
    { "element": "nombre", "problem": "descripción concreta", "suggestion": "solución accionable", "severity": "high/medium/low" }
  ]
}

Reglas:
- Sé conservador con la puntuación: 100 solo si la interfaz es realmente muy sólida.
- Si hay varios fallos, sepáralos en issues distintos.
- Si una señal es incierta pero plausible, reporta un issue de severidad baja o media.
- No devuelvas texto adicional fuera del JSON.
`;

const buildCodePrompt = (filename: string, codeContent: string) => `
Actúa como un auditor extremadamente estricto en Accesibilidad Web (WCAG 2.1) y Código Limpio.
Analiza este archivo de código fuente: "${filename}".
Busca con especial atención: HTML semántico incorrecto, etiquetas ARIA ausentes o mal usadas, imágenes sin alt, controles sin nombre accesible, enlaces con target="_blank" inseguros, jerarquía de encabezados incoherente y patrones que degraden la usabilidad asistiva.

CÓDIGO:
\`\`\`
${codeContent}
\`\`\`

Devuelve SOLO JSON válido con esta estructura:
{
  "score": 0-100,
  "issues": [
    { "element": "linea o sección", "problem": "explicación concreta", "suggestion": "corrección", "severity": "high/medium/low" }
  ]
}

Reglas:
- No te limites a fallos críticos: también reporta omisiones relevantes y malas prácticas de accesibilidad.
- Si detectas un problema, crea un issue específico para él.
- No devuelvas texto adicional fuera del JSON.
`;

const analyzeVisual = async (imageBase64: string, mimeType: string, context?: WebsiteAuditContext) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 1024
    }
  });

  const prompt = buildVisualPrompt(context);
  const fallbackIssues = buildVisualHeuristics(context);

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType } }
    ]);

    const text = result.response.text();
    const cleanJson = extractJsonPayload(text);
    const parsed = JSON.parse(cleanJson);

    return { json: normalizeAuditPayload(parsed, fallbackIssues), raw: text };
  } catch (e) {
    return { json: normalizeAuditPayload({ score: 0, issues: fallbackIssues }, fallbackIssues), raw: '' };
  }
};

const analyzeCode = async (codeContent: string, filename: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 1024
    }
  });

  const prompt = buildCodePrompt(filename, codeContent);
  const fallbackIssues = buildCodeHeuristics(codeContent);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = extractJsonPayload(text);
    const parsed = JSON.parse(cleanJson);

    return { json: normalizeAuditPayload(parsed, fallbackIssues), raw: text };
  } catch (e) {
    return { json: normalizeAuditPayload({ score: 0, issues: fallbackIssues }, fallbackIssues), raw: '' };
  }
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

export const analyzeImage = async (req: Request, res: Response) => {
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
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore cleanup failures
      }
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

    const { imageBase64, pageTitle, auditContext } = await captureWebsite(url);
    const { json, raw } = await analyzeVisual(imageBase64, 'image/png', auditContext);

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

      const newAudit = new Audit({
        score: json.score,
        issues: json.issues,
        rawResponse: raw,
        project: savedProjectId
      });
      await newAudit.save();

      console.log(`✅ URL guardada con captura: ${filename}`);

      await notifyN8n(newProject, userId);
    }

    res.json({ success: true, data: json, savedId: savedProjectId });
  } catch (error: any) {
    console.error('❌ Error URL:', error);
    res.status(500).json({ message: 'Error analizando web', error: error.message });
  }
};