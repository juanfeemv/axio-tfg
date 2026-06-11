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

const safeJsonParse = (raw: string): any => {
  // Intento 1: parse directo
  try { return JSON.parse(raw); } catch { }

  // Intento 2: reparar strings mal cerradas (Gemini a veces trunca)
  // Si el JSON está cortado, cerramos el último string y el JSON
  const fixed = raw.replace(/(?<!\\)"([^"\\]*(\\.[^"\\]*)*)$/, '"');
  try { return JSON.parse(fixed + '}'); } catch { }

  // Intento 3: extraer score + issues del JSON roto (Gemini a veces trunca la respuesta)
  try {
    const scoreMatch = raw.match(/"score"\s*:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extraer la sección del array issues (puede estar truncada, sin cierre ])
    const issuesStart = raw.indexOf('"issues"');
    let issuesRaw = '';
    if (issuesStart >= 0) {
      const afterIssues = raw.slice(issuesStart);
      const bracketStart = afterIssues.indexOf('[');
      if (bracketStart >= 0) {
        const arrContent = afterIssues.slice(bracketStart + 1);
        const closingBracket = arrContent.lastIndexOf(']');
        // Si el array está cerrado, tomamos hasta ]; si no (JSON truncado), todo el contenido
        issuesRaw = closingBracket >= 0 ? arrContent.slice(0, closingBracket) : arrContent;
      }
    }

    let issues: any[] = [];
    if (issuesRaw.trim()) {
      // Separar objetos del array: buscar }{ que separa dos objetos
      const objBoundaries: number[] = [];
      let depth = 0;
      for (let i = 0; i < issuesRaw.length; i++) {
        if (issuesRaw[i] === '{') { depth++; }
        else if (issuesRaw[i] === '}') {
          depth--;
          if (depth === 0) objBoundaries.push(i);
        }
      }

      let start = 0;
      for (const end of objBoundaries) {
        const objStr = issuesRaw.slice(start, end + 1).trim();
        if (objStr.startsWith(',')) start++; // saltar coma entre objetos
        try {
          const cleaned = objStr.replace(/,\s*$/, ''); // quitar coma final
          if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            issues.push(JSON.parse(cleaned));
          }
        } catch { }
        start = end + 1;
      }
    }

    return { score, issues };
  } catch { }

  // Intento 4: devolver vacío
  return { score: 0, issues: [] };
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

// Puntuación restada por cada issue según su severidad.
// Penalización máxima total: 35 puntos (evita que muchas issues hundan el score).
const severityPenalty = (severity: AuditSeverity) => {
  switch (severity) {
    case 'high':
      return 10;
    case 'medium':
      return 5;
    default:
      return 2;
  }
};

// Normaliza y calcula la puntuación final combinando lo que dice Gemini + heurísticas propias.
// Aplica un cap por número de issues (0-1 issues = análisis superficial, se penaliza).
const normalizeAuditPayload = (payload: any, fallbackIssues: AuditIssue[] = [], useHeuristicBase = false): AuditPayload => {
  const issues = dedupeIssues([...normalizeIssues(payload?.issues), ...fallbackIssues]);

  let baseScore: number;
  if (useHeuristicBase) {
    baseScore = Math.max(0, 100 - issues.reduce((total, issue) => total + severityPenalty(issue.severity), 0));
  } else {
    baseScore = clampScore(payload?.score);
  }

  // Penalización por issues: resta puntos pero con límite máximo
  const rawPenalty = issues.reduce((total, issue) => total + severityPenalty(issue.severity), 0);
  const penalty = Math.min(rawPenalty, 35);

  // Cap por número de issues: 0-1 issues = análisis superficial, se penaliza
  const issueCountCap = issues.length === 0 ? 50 : issues.length === 1 ? 70 : 100;

  const strictScore = Math.max(0, Math.min(baseScore - penalty, issueCountCap));

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
  const isHTML = /<(!DOCTYPE|html|head|body|div|span|p|a|img|button|input|form|table|section|header|footer|nav|main|article|aside|h[1-6]|ul|ol|li)/i.test(codeContent);

  if (isHTML) {
    if (!/<html[^>]*\blang\s*=/i.test(codeContent)) {
      issues.push({
        element: '<html>',
        problem: 'Falta el atributo lang en el elemento html.',
        suggestion: 'Añade lang="es" (o el idioma correspondiente) al elemento <html>.',
        severity: 'high'
      });
    }

    if (!/<title>/i.test(codeContent) || /<title>\s*<\/title>/i.test(codeContent)) {
      issues.push({
        element: '<head>',
        problem: 'Falta un elemento title significativo.',
        suggestion: 'Añade <title> con un texto descriptivo de la página.',
        severity: 'high'
      });
    }

    if (!/<meta[^>]*charset/i.test(codeContent)) {
      issues.push({
        element: '<head>',
        problem: 'Falta la declaración de charset.',
        suggestion: 'Añade <meta charset="UTF-8"> en el <head>.',
        severity: 'medium'
      });
    }

    if (!/<meta[^>]*viewport/i.test(codeContent)) {
      issues.push({
        element: '<head>',
        problem: 'Falta la etiqueta meta viewport para diseño responsive.',
        suggestion: 'Añade <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
        severity: 'high'
      });
    }
  }

  const imgPattern = /<img\b(?![^>]*\balt\s*=)[^>]*>/i;
  const imgEmptyAltPattern = /<img\b[^>]*\balt\s*=\s*["']\s*["'][^>]*>/i;
  const blankTargetPattern = /<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/i;
  const hasNoopener = /rel\s*=\s*["'][^"']*noopener/i.test(codeContent);
  const hasNoreferrer = /rel\s*=\s*["'][^"']*noreferrer/i.test(codeContent);
  const buttonPattern = /<button\b(?![^>]*\b(aria-label|title)\s*=)[^>]*>/i;
  const inputPattern = /<input\b(?![^>]*\b(aria-label|title|placeholder)\s*=)[^>]*type\s*=\s*["'](?!hidden|submit|reset|button)[^"']*["']/i;
  const emptyHeadingPattern = /<h[1-6]\b[^>]*>\s*<\/h[1-6]>/i;
  const labelForPattern = /<label\b[^>]*\bfor\s*=/i;
  const inputWithIdPattern = /<input\b[^>]*\bid\s*=/i;
  const roleNoneMissingPattern = /<img\b[^>]*\balt\s*=\s*["']\s*["'][^>]*>(?!.*\brole\s*=\s*["']presentation["'])/i;

  if (isHTML) {
    if (!/<main\b/i.test(codeContent) && !/role\s*=\s*["']main["']/i.test(codeContent)) {
      issues.push({
        element: 'estructura semántica',
        problem: 'No se detecta un elemento <main> o role="main".',
        suggestion: 'Envuelve el contenido principal en <main> o usa role="main".',
        severity: 'medium'
      });
    }

    if (!/<nav\b/i.test(codeContent) && !/role\s*=\s*["']navigation["']/i.test(codeContent)) {
      issues.push({
        element: 'estructura semántica',
        problem: 'No se detecta un elemento <nav> o role="navigation" para la navegación.',
        suggestion: 'Usa <nav> para envolver los menús de navegación principales.',
        severity: 'low'
      });
    }

    if (!/<h1\b/i.test(codeContent)) {
      issues.push({
        element: 'jerarquía de títulos',
        problem: 'Falta un encabezado H1 principal.',
        suggestion: 'Incluye un <h1> que describa el propósito principal de la página.',
        severity: 'high'
      });
    }

    if (inputWithIdPattern.test(codeContent) && !labelForPattern.test(codeContent)) {
      issues.push({
        element: 'formularios',
        problem: 'Hay inputs con id pero no se detectan etiquetas label asociadas con for.',
        suggestion: 'Asocia cada input con un <label for="id"> o usa aria-label/aria-labelledby.',
        severity: 'high'
      });
    }
  }

  if (imgPattern.test(codeContent)) {
    issues.push({
      element: getSafeLineLabel(codeContent, imgPattern),
      problem: 'Hay una imagen sin atributo alt descriptivo.',
      suggestion: 'Añade un alt breve y útil, o usa alt="" con role="presentation" si es decorativa.',
      severity: 'high'
    });
  }

  if (roleNoneMissingPattern.test(codeContent)) {
    issues.push({
      element: getSafeLineLabel(codeContent, roleNoneMissingPattern),
      problem: 'Imagen decorativa con alt="" pero sin role="presentation".',
      suggestion: 'Añade role="presentation" o aria-hidden="true" a las imágenes decorativas.',
      severity: 'low'
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

  if (buttonPattern.test(codeContent) && isHTML) {
    issues.push({
      element: 'botones',
      problem: 'Hay botones sin aria-label ni text content descriptivo.',
      suggestion: 'Añade aria-label o texto visible a cada botón.',
      severity: 'high'
    });
  }

  if (emptyHeadingPattern.test(codeContent)) {
    issues.push({
      element: getSafeLineLabel(codeContent, emptyHeadingPattern),
      problem: 'Hay un encabezado vacío sin contenido.',
      suggestion: 'Elimina los encabezados sin contenido o añade texto descriptivo.',
      severity: 'low'
    });
  }

  const tabindexPositive = /tabindex\s*=\s*["']\d+["']/i;
  if (tabindexPositive.test(codeContent)) {
    const match = codeContent.match(/tabindex\s*=\s*["'](\d+)["']/i);
    if (match && parseInt(match[1]) > 0) {
      issues.push({
        element: 'navegación por teclado',
        problem: `Uso de tabindex="${match[1]}" positivo, que altera el orden natural de tabulación.`,
        suggestion: 'Evita tabindex positivo. Usa solo tabindex="0" o tabindex="-1" y deja el orden del DOM definir la navegación.',
        severity: 'medium'
      });
    }
  }

  const bareDivOnClick = /<div\b(?![^>]*\brole\s*=)[^>]*\bonclick\s*=/i;
  if (bareDivOnClick.test(codeContent)) {
    issues.push({
      element: getSafeLineLabel(codeContent, bareDivOnClick),
      problem: 'Un div con onclick sin rol semántico no es accesible por teclado.',
      suggestion: 'Usa <button> o añade role="button" y tabindex="0" al div interactivo.',
      severity: 'high'
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
      problem: 'La página no declara el idioma principal. Los lectores de pantalla (JAWS, NVDA) seleccionan el motor de voz incorrecto, pronunciando el contenido de forma incomprensible para usuarios ciegos.',
      suggestion: 'Añade lang="es" (o el idioma correspondiente) al elemento <html> para que los lectores de pantalla elijan la voz adecuada.',
      severity: 'high'
    });
  }

  if (!context.hasViewportMeta) {
    issues.push({
      element: 'metadatos',
      problem: 'Falta la etiqueta viewport. En móviles, el contenido se muestra a escala de escritorio, obligando a los usuarios con baja visión a hacer zoom constante para leer cualquier texto.',
      suggestion: 'Incluye <meta name="viewport" content="width=device-width, initial-scale=1.0"> para que el diseño sea legible sin zoom en dispositivos móviles.',
      severity: 'high'
    });
  }

  if (counts.images > 0 && counts.imagesWithoutAlt / counts.images > 0.3) {
    issues.push({
      element: 'imágenes',
      problem: `El ${Math.round(counts.imagesWithoutAlt / counts.images * 100)}% de las imágenes (${counts.imagesWithoutAlt} de ${counts.images}) carecen de texto alternativo. Para un usuario ciego que usa lector de pantalla, estas imágenes son completamente invisibles: el lector anuncia solo "imagen" sin ningún contexto.`,
      suggestion: 'Añade alt descriptivo a cada imagen informativa. Si la imagen es puramente decorativa, usa alt="" con role="presentation" para que el lector de pantalla la ignore.',
      severity: 'high'
    });
  } else if (counts.imagesWithoutAlt > 0) {
    issues.push({
      element: 'imágenes',
      problem: `${counts.imagesWithoutAlt} imagen(es) sin texto alternativo. Un usuario con lector de pantalla escucha "imagen" sin saber qué muestra, perdiendo información visual clave del contenido.`,
      suggestion: 'Añade un atributo alt descriptivo que transmita el mismo mensaje que la imagen, o alt="" si es decorativa.',
      severity: 'high'
    });
  }

  if (counts.buttonsWithoutAccessibleName > 0) {
    issues.push({
      element: 'botones',
      problem: `${counts.buttonsWithoutAccessibleName} botón(es) sin nombre accesible. Para un usuario ciego, el lector de pantalla anuncia únicamente "botón" sin indicar qué acción realiza. Esto hace imposible navegar la interfaz sin visión.`,
      suggestion: 'Añade texto visible dentro del botón o un atributo aria-label="Acción descriptiva" para que el lector de pantalla lo anuncie correctamente.',
      severity: 'high'
    });
  }

  if (counts.linksBlankWithoutRel > 0) {
    issues.push({
      element: 'enlaces',
      problem: `${counts.linksBlankWithoutRel} enlace(s) abren una nueva pestaña sin advertencia y sin rel="noopener noreferrer". Para un usuario de lector de pantalla o teclado, el contexto cambia de forma inesperada, causando desorientación y un riesgo de seguridad (tab-napping).`,
      suggestion: 'Añade rel="noopener noreferrer" a los enlaces con target="_blank". Considera también notificar al usuario con texto o un icono que el enlace abre en nueva pestaña.',
      severity: 'medium'
    });
  }

  if (counts.formFieldsWithoutLabel > 0) {
    issues.push({
      element: 'formularios',
      problem: `${counts.formFieldsWithoutLabel} campo(s) de formulario sin etiqueta asociada. Un usuario ciego no sabe qué debe escribir en cada campo porque el lector de pantalla no puede anunciar su propósito. Un usuario con discapacidad cognitiva tampoco tiene referencia visual clara.`,
      suggestion: 'Asocia cada campo con un <label for="id-del-campo"> visible, o usa aria-label / aria-labelledby si no es posible el label visible.',
      severity: 'high'
    });
  }

  if (context.headingStructure.length > 0 && !context.headingStructure.some((heading) => heading.startsWith('H1:'))) {
    issues.push({
      element: 'jerarquía de títulos',
      problem: 'La página tiene encabezados pero ningún H1 principal. Los usuarios de lector de pantalla usan los encabezados para navegar la página como un índice; sin H1, no existe un punto de entrada claro y la estructura del contenido es confusa.',
      suggestion: 'Define un único <h1> que describa el propósito principal de la página. El resto de encabezados deben seguir una jerarquía lógica (h2, h3…).',
      severity: 'high'
    });
  }

  if (context.headingStructure.length === 0) {
    issues.push({
      element: 'estructura semántica',
      problem: 'La página no contiene ningún encabezado HTML (h1-h6). Los usuarios de lector de pantalla no pueden saltar entre secciones y deben escuchar todo el contenido de forma lineal, lo que hace la navegación extremadamente lenta y frustrante.',
      suggestion: 'Estructura el contenido con encabezados jerárquicos: un <h1> principal y <h2>/<h3> para subsecciones.',
      severity: 'medium'
    });
  }

  if (counts.mainLandmarks === 0) {
    issues.push({
      element: 'estructura semántica',
      problem: 'No existe un elemento <main> o landmark "main". Los usuarios de lector de pantalla y teclado no pueden saltar directamente al contenido principal, obligándolos a navegar manualmente por toda la cabecera y navegación en cada página.',
      suggestion: 'Envuelve el contenido principal en <main> para que los usuarios de tecnología asistiva puedan saltar directamente a él con un solo comando.',
      severity: 'medium'
    });
  }

  if (counts.navLandmarks === 0) {
    issues.push({
      element: 'estructura semántica',
      problem: 'No se detecta un elemento <nav> o landmark de navegación. Los usuarios de lector de pantalla no pueden identificar ni saltar directamente a los menús de navegación.',
      suggestion: 'Envuelve los menús de navegación en <nav> o usa role="navigation" con aria-label descriptivo para distinguir entre múltiples menús.',
      severity: 'low'
    });
  }

  return issues;
};



const buildVisualPrompt = (context?: WebsiteAuditContext) => `
Eres un auditor de accesibilidad. Analiza esta captura de pantalla.

REGLA OBLIGATORIA: Devuelve TODOS los problemas de accesibilidad que detectes (minimo 6, sin maximo). Busca cada categoria a fondo. Descripciones BREVES (1-2 frases) para que quepan muchos resultados.

Mira la captura con los ojos de una persona con discapacidad:

1. BAJA VISION: texto diminuto?, contraste pobre?, fuentes finas/ilegibles?, texto sobre imagenes sin mascara?

2. DALTONISMO: rojo/verde como unicos indicadores de estado?, graficos solo distinguibles por color?, combinaciones problematicas rojo/negro, azul/morado, gris/azul?

3. LECTOR DE PANTALLA: contenido en imagenes sin texto?, iconos sin etiqueta?, popups/cookies sin boton claro?, graficos sin descripcion textual?

4. DISCAPACIDAD COGNITIVA: interfaz sobrecargada?, paredes de texto sin estructura?, demasiados colores/fuentes distintas?, animaciones sin control?

5. TECLADO: elementos diminutos (<44px)?, sin foco visible?, menus no navegables sin raton?

Contexto DOM (solo si es analisis de URL, ignora si no hay datos):
${context ? JSON.stringify(context, null, 2) : 'No disponible (es un archivo subido, analiza solo la imagen)'}

SCORE: Se realista y justo. 85-100 sitios ejemplares con accesibilidad cuidada. 65-84 aceptable, tiene carencias pero funciona. 45-64 necesita mejoras claras. <45 accesibilidad deficiente.

Devuelve SOLO JSON:
{
  "score": 0-100,
  "issues": [
    {
      "element": "componente visual",
      "problem": "que experimenta una persona con discapacidad",
      "suggestion": "solucion concreta",
      "severity": "high|medium|low"
    }
  ]
}
`;

const buildCodePrompt = (filename: string, codeContent: string) => `
Eres un auditor de codigo para accesibilidad. Analiza: "${filename}".

REGLA OBLIGATORIA: Devuelve TODOS los problemas que detectes (minimo 4, sin maximo). Todo codigo HTML/CSS/JS tiene fallos de accesibilidad. Descripciones BREVES.

Busca y describe como afecta CADA fallo a una persona real:
- HTML semantico (div como boton sin role → usuario de lector no sabe que es interactivo)
- ARIA (falta aria-label → lector anuncia "boton" sin proposito)
- Imagenes (sin alt → usuario ciego no sabe que muestra; alt="" sin role="presentation" → aun se anuncia)
- Controles (sin texto ni aria-label → usuario de teclado no sabe que accion realiza)
- Enlaces (target="_blank" sin rel → riesgo de seguridad y desorientacion)
- Encabezados (falta h1 o saltos → usuario no puede navegar la estructura)
- tabindex positivo → orden de tabulacion roto
- CSS (contraste bajo, font-size fijo en px, animaciones sin prefers-reduced-motion, falta :focus-visible)
- Formularios (input sin label → usuario ciego no sabe que dato escribir)

CODIGO:
\`\`\`
${codeContent}
\`\`\`

Devuelve SOLO JSON:
{
  "score": 0-100,
  "issues": [
    { "element": "linea o selector CSS", "problem": "que experimenta un usuario con discapacidad", "suggestion": "codigo de ejemplo corregido", "severity": "high|medium|low" }
  ]
}
`;

// Envía la imagen + prompt a Gemini 2.5 Flash, parsea la respuesta JSON,
// y la combina con heurísticas del DOM como fallback si algo falla.
const analyzeVisual = async (imageBase64: string, mimeType: string, context?: WebsiteAuditContext) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 8192
    }
  });

  const prompt = buildVisualPrompt(context);
  const fallbackIssues = buildVisualHeuristics(context);

  // Añadir texto extra para archivos sin DOM: obligar a buscar defectos visuales
  const fileUploadNotice = !context
    ? '\n\nNOTA IMPORTANTE: Este es un archivo de diseño/imagen subido por un usuario para revisión. No tienes datos del DOM. DEBES analizar EXCLUSIVAMENTE la imagen: colores, contraste, tipografía, legibilidad, densidad visual. Encuentra al menos 5 problemas. Si no ves ninguno, mira con más atención: cada diseño tiene algo que mejorar para accesibilidad.'
    : '';

  try {
    const result = await model.generateContent([
      { inlineData: { data: imageBase64, mimeType } },
      prompt + fileUploadNotice
    ]);

    const text = result.response.text();
    console.log('📝 [Gemini raw]', text.slice(0, 300));
    const cleanJson = extractJsonPayload(text);
    const parsed = safeJsonParse(cleanJson);
    console.log('📊 [Gemini parsed] score:', parsed?.score, 'issues:', parsed?.issues?.length);
    const normalized = normalizeAuditPayload(parsed, fallbackIssues, false);
    console.log('✅ [Final score]', normalized.score, 'issues:', normalized.issues.length);
    return { json: normalized, raw: text };
  } catch (e) {
    console.error('❌ [Gemini fallback] Error en Gemini, usando solo heurísticas:', e);
    return { json: normalizeAuditPayload({ score: 0, issues: [] }, fallbackIssues, true), raw: '' };
  }
};


const analyzeCode = async (codeContent: string, filename: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 8192
    }
  });

  const prompt = buildCodePrompt(filename, codeContent);
  const fallbackIssues = buildCodeHeuristics(codeContent);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = extractJsonPayload(text);
    const parsed = safeJsonParse(cleanJson);

    return { json: normalizeAuditPayload(parsed, fallbackIssues, false), raw: text };
  } catch (e) {
    return { json: normalizeAuditPayload({ score: 0, issues: [] }, fallbackIssues, true), raw: '' };
  }
};

// Notifica a n8n vía webhook cuando se completa una auditoría.
// Si n8n no está configurado (variable de entorno vacía), se omite sin fallar.
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

const notifyDiscord = async (project: any, userId: string, hasAI: boolean) => {
  try {
    const discordUrl = process.env.N8N_WEBHOOK_URL_DISCORD;
    if (!discordUrl) return;

    const userInfo = await User.findById(userId).select('username email');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(discordUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        projectId: project._id,
        title: project.title,
        type: project.type,
        url: project.input,
        ownerName: userInfo?.username || userInfo?.email || 'Usuario Anónimo',
        createdAt: project.createdAt,
        hasAI,
        score: project.accessibilityScore ?? 0
      })
    });

    clearTimeout(timeoutId);
    console.log('✅ Discord notificado (proyecto subido)');
  } catch (discordError) {
    console.error('❌ Error al notificar Discord:', discordError);
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
      await notifyDiscord(newProject, userId, false);
    } else {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore cleanup failures
      }
    }

    const imageBase64Result = projectType === 'file' ? resultIA.json : undefined;
    res.json({ success: true, data: { ...json, filename: req.file.originalname }, savedId: savedProjectId });
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
      await notifyDiscord(newProject, userId, true);
    }

    res.json({ success: true, data: { ...json, pageTitle, url, screenshot: imageBase64 }, savedId: savedProjectId });
  } catch (error: any) {
    console.error('❌ Error URL:', error);
    res.status(500).json({ message: 'Error analizando web', error: error.message });
  }
};