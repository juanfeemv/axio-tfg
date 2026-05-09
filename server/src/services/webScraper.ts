import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Rutas comunes de Chromium en sistemas Linux/ARM (Raspberry Pi, Debian, Ubuntu)
const CHROMIUM_CANDIDATES = [
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/brave-browser',
  '/snap/bin/chromium',
];

const resolveExecutablePath = (): string | undefined => {
  // Si el usuario lo ha definido explícitamente en el .env, respetamos eso
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH?.trim();
  if (envPath) {
    console.log(`🔧 Usando ejecutable de Chromium del .env: ${envPath}`);
    return envPath;
  }

  // En Linux/ARM buscamos el binario del sistema automáticamente
  if (process.platform === 'linux') {
    for (const candidate of CHROMIUM_CANDIDATES) {
      if (fs.existsSync(candidate)) {
        console.log(`🔧 Chromium del sistema detectado automáticamente: ${candidate}`);
        return candidate;
      }
    }
    console.warn('⚠️  No se encontró Chromium en el sistema. Puppeteer usará su propio binario (puede fallar en ARM).');
  }

  return undefined; // Puppeteer usa su propio binario descargado
};

export const captureWebsite = async (url: string): Promise<{ imageBase64: string, pageTitle: string }> => {
  
  console.log("📸 Puppeteer iniciando captura de:", url);

  const executablePath = resolveExecutablePath();

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',      // Vital para entornos con poca RAM (Raspberry Pi)
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

    // User-agent de un navegador real para evitar bloqueos por bot-detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Viewport de portátil estándar
    await page.setViewport({ width: 1280, height: 800 });

    // Timeout generoso para redes lentas
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Espera de seguridad para animaciones y cargas asíncronas
    await new Promise(r => setTimeout(r, 2000));

    const pageTitle = await page.title();

    // Captura en Base64
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    await browser.close();
    console.log("✅ Captura completada con éxito");

    return {
      imageBase64: screenshot as string,
      pageTitle
    };

  } catch (error: any) {
    // Cerramos el navegador si falla para no dejar procesos zombie
    try { await browser.close(); } catch (_) {}
    console.error("❌ Error en Puppeteer:", error.message);
    throw new Error(`No se pudo capturar la web "${url}". Verifica que la URL sea pública y accesible. Detalle: ${error.message}`);
  }
};