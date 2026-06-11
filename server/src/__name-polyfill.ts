// Polyfill para el helper __name que esbuild/tsx usa al transpilar puppeteer
// Debe ser el PRIMER import en app.ts
// esbuild: __name(target, value) -> Object.defineProperty y devuelve target
(globalThis as any).__name = (target: any, value: any) => {
  Object.defineProperty(target, 'name', { value, configurable: true });
  return target;
};
console.log('✅ __name polyfill cargado correctamente');
