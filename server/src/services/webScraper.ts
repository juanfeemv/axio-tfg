import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

export const captureWebsite = async (url: string): Promise<{ imageBase64: string, pageTitle: string }> => {
  
  console.log("📸 Puppeteer iniciando captura de:", url);

  const browser = await puppeteer.launch({
    headless: true,
    // CLAVE PARA DOCKER: Si existe la variable (en el contenedor), usa ese navegador.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Vital para evitar crash de memoria en Docker
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process' // Ayuda a cargar algunos iframes/recursos
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Optimizamos el viewport para que parezca un portátil estándar
    await page.setViewport({ width: 1280, height: 800 });

    // Navegamos esperando solo a que el DOM esté listo
    // Aumentamos timeout a 60s por si la red de Docker va lenta
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Pequeña espera de seguridad para animaciones o cargas asíncronas
    await new Promise(r => setTimeout(r, 2000));

    const pageTitle = await page.title();
    
    // Sacamos captura en Base64
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });

    await browser.close();
    console.log("✅ Captura completada con éxito");

    return { 
      imageBase64: screenshot as string,
      pageTitle
    };

  } catch (error) {
    // Aseguramos cerrar el navegador si falla algo para no dejar procesos zombies
    if (browser) await browser.close();
    
    console.error("❌ Error en Puppeteer:", error);
    throw new Error(`No se pudo acceder a la web ${url}. Verifica que sea pública y accesible.`);
  }
};