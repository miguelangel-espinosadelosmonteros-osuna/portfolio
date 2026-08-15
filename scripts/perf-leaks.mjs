// Comprueba si quedan bucles de animación vivos tras navegar fuera de la
// página que los creó. Uso: node scripts/perf-leaks.mjs [baseUrl]
import puppeteer from 'puppeteer';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Instrumentamos rAF antes de que cargue la app para contar bucles activos.
await page.evaluateOnNewDocument(() => {
  window.__rafActivos = 0;
  const origRaf = window.requestAnimationFrame.bind(window);
  const origCancel = window.cancelAnimationFrame.bind(window);
  const vivos = new Set();
  window.requestAnimationFrame = (cb) => {
    const id = origRaf((t) => {
      vivos.delete(id);
      cb(t);
    });
    vivos.add(id);
    window.__rafActivos = vivos.size;
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    vivos.delete(id);
    window.__rafActivos = vivos.size;
    origCancel(id);
  };
});

const medir = async (etiqueta) => {
  await new Promise((r) => setTimeout(r, 2500));
  // Cuántos callbacks de rAF se ejecutan en 1 segundo: proxy del trabajo por frame.
  const trabajo = await page.evaluate(
    () =>
      new Promise((res) => {
        let n = 0;
        const t0 = performance.now();
        const tick = () => {
          n++;
          if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
          else res(n);
        };
        requestAnimationFrame(tick);
      })
  );
  const canvas = await page.evaluate(
    () => document.querySelectorAll('canvas').length
  );
  console.log(`  ${etiqueta.padEnd(28)} canvas_en_dom=${canvas}  frames/s=${trabajo}`);
};

console.log(`\n=== ${BASE} ===`);
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
await medir('home (particulas activas)');

// Navegación de cliente, como la haría un visitante pulsando el menú.
await page.evaluate(() => {
  const link = [...document.querySelectorAll('a')].find((a) =>
    a.getAttribute('href')?.includes('/projects')
  );
  link?.click();
});
await medir('tras ir a /projects');

await browser.close();
