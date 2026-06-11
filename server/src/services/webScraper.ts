import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export interface WebsiteAuditContext {
  url: string;
  title: string;
  lang: string;
  hasViewportMeta: boolean;
  headingStructure: string[];
  counts: {
    images: number;
    imagesWithoutAlt: number;
    buttonsWithoutAccessibleName: number;
    linksBlankWithoutRel: number;
    formFieldsWithoutLabel: number;
    mainLandmarks: number;
    navLandmarks: number;
  };
}

export interface WebsiteCaptureResult {
  imageBase64: string;
  pageTitle: string;
  auditContext: WebsiteAuditContext;
}

// Rutas comunes de Chromium en sistemas Linux/ARM (Raspberry Pi, Debian, Ubuntu, Alpine)
const CHROMIUM_CANDIDATES = [
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser-v8',  // Alpine edge
  '/usr/bin/brave-browser',
  '/snap/bin/chromium',
  '/usr/lib/chromium/chromium',    // some ARM distros
];

const resolveExecutablePath = (): string | undefined => {
  // Si el usuario lo ha definido explícitamente en el .env, respetamos eso
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH?.trim();
  if (envPath) {
    try {
      fs.accessSync(envPath, fs.constants.X_OK);
      console.log(`🔧 Usando ejecutable de Chromium del .env: ${envPath}`);
      return envPath;
    } catch {
      console.warn(`⚠️  Ruta del .env no accesible: ${envPath}. Buscando Chromium automáticamente...`);
    }
  }

  // En Linux/ARM buscamos el binario del sistema automáticamente
  if (process.platform === 'linux') {
    for (const candidate of CHROMIUM_CANDIDATES) {
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        console.log(`🔧 Chromium del sistema detectado: ${candidate}`);
        return candidate;
      } catch {
        // sigue buscando
      }
    }
    console.warn('⚠️  No se encontró Chromium en el sistema. Lista de rutas probadas:');
    for (const candidate of CHROMIUM_CANDIDATES) {
      console.warn(`   - ${candidate} (no encontrado)`);
    }
    console.warn('⚠️  Instálalo con: sudo apt-get install -y chromium-browser');
  }

  return undefined; // Puppeteer usará su propio binario (puppeteer-core NO tiene binario propio)
};

export const captureWebsite = async (url: string): Promise<WebsiteCaptureResult> => {
  // Lanza un navegador Chrome headless real para renderizar la página completa,
  // ejecutar su JavaScript y capturar tanto el DOM como una screenshot.
  // Esto es necesario porque Cheerio solo parsea HTML estático sin JS.

  console.log("📸 Puppeteer iniciando captura de:", url);

  const executablePath = resolveExecutablePath();

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,          // Sin interfaz gráfica (modo servidor)
      executablePath,          // Chromium del sistema (Debian/ARM)
      args: [
        '--no-sandbox',                    // Necesario en Docker (ejecuta como root)
        '--disable-setuid-sandbox',        // Evita errores de permisos en contenedores
        '--disable-dev-shm-usage',         // Usa /tmp en vez de /dev/shm (crítico en RPi con poca RAM)
        '--disable-gpu',
        '--disable-extensions',
        '--disable-software-rasterizer',
        '--disable-background-networking',
        '--disable-default-apps',
        '--no-first-run',
        '--mute-audio',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
  } catch (launchError: any) {
    const hint = process.platform === 'linux'
      ? ' En Raspberry Pi, instala Chromium con: sudo apt-get install -y chromium-browser'
      : '';
    throw new Error(`No se pudo iniciar el navegador.${hint} Error: ${launchError.message}`);
  }

  try {
    const page = await browser.newPage();

    // User-agent real para que la web no nos detecte como bot y nos bloquee
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Viewport estándar de portátil para capturar diseño responsive real
    await page.setViewport({ width: 1280, height: 800 });

    // Navegar a la URL y esperar a que el DOM principal esté listo
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Espera extra para animaciones, lazy loading y peticiones asíncronas
    await new Promise(r => setTimeout(r, 2000));

    const pageTitle = await page.title();

    // Extraer datos del DOM para las heurísticas de accesibilidad
    // page.evaluate() ejecuta JS en el contexto del navegador (no en Node)
    const auditContext = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map((h) => `${h.tagName}: ${(h.textContent || '').trim().replace(/\s+/g, ' ')}`)
        .filter((h) => h.length > 4)
        .slice(0, 12);

      const images = Array.from(document.querySelectorAll('img'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a[target="_blank"]'));
      const fields = Array.from(document.querySelectorAll('input, textarea, select'));

      return {
        url: location.href,
        title: document.title,
        lang: document.documentElement.lang || '',
        hasViewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
        headingStructure: headings,
        counts: {
          images: images.length,
          imagesWithoutAlt: images.filter((img) => !img.hasAttribute('alt')).length,
          buttonsWithoutAccessibleName: buttons.filter((btn) => {
            const label = (btn.getAttribute('aria-label') || btn.getAttribute('title') || '').trim();
            const text = (btn.textContent || '').trim();
            return !label && !text;
          }).length,
          linksBlankWithoutRel: links.filter((a) => {
            const rel = (a.getAttribute('rel') || '').toLowerCase();
            return !rel.includes('noopener') || !rel.includes('noreferrer');
          }).length,
          formFieldsWithoutLabel: fields.filter((field) => {
            const tagName = field.tagName.toLowerCase();
            if (tagName === 'input') {
              const type = field.getAttribute('type') || '';
              if (['hidden', 'submit', 'reset', 'button', 'image'].includes(type)) return false;
            }
            // Inline: check if field has an associated label
            if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby')) return false;
            if (field.closest('label')) return false;
            const id = field.getAttribute('id');
            if (!id) return true;
            return !document.querySelector('label[for="' + id.replace(/"/g, '\\"') + '"]');
          }).length,
          mainLandmarks: document.querySelectorAll('main').length,
          navLandmarks: document.querySelectorAll('nav').length
        }
      };
    });

    // Captura en Base64
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    await browser.close();
    console.log("✅ Captura completada con éxito");

    return {
      imageBase64: screenshot as string,
      pageTitle,
      auditContext
    };

  } catch (error: any) {
    // Cerramos el navegador si falla para no dejar procesos zombie
    try { await browser.close(); } catch (_) {}
    console.error("❌ Error en Puppeteer:", error.message);
    throw new Error(`No se pudo capturar la web "${url}". Verifica que la URL sea pública y accesible. Detalle: ${error.message}`);
  }
};