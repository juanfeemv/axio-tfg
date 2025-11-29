import puppeteer from 'puppeteer';

export const captureWebsite = async (url: string): Promise<{ imageBase64: string, pageTitle: string }> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Ajustamos tamaño de pantalla
    await page.setViewport({ width: 1280, height: 800 });

    // CAMBIO CLAVE: Usamos 'domcontentloaded' en vez de 'networkidle0'
    // Esto evita que se quede colgado esperando scripts de analytics o anuncios
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Truco profesional: Esperamos 3 segundos "a mano" para que terminen animaciones de carga
    // Es mucho más fiable que esperar a la red
    await new Promise(r => setTimeout(r, 3000));

    const pageTitle = await page.title();

    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });

    await browser.close();

    return { 
      imageBase64: screenshot as string,
      pageTitle
    };

  } catch (error) {
    await browser.close();
    console.error("❌ Error en Puppeteer:", error);
    throw new Error('No se pudo acceder a la web. Verifica la URL o tu conexión.');
  }
};