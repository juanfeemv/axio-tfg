// Polyfill para el helper __name que usa esbuild/tsx con puppeteer
globalThis.__name = (target, value) => value;
