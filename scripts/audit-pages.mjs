// Auditoría de páginas: errores de consola, desbordamiento horizontal y
// capturas por viewport. Uso: node scripts/audit-pages.mjs
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTES = ["/", "/about", "/projects", "/contact", "/projects/aps"];
const VIEWPORTS = [
  { name: 'movil', width: 375, height: 812 },
  { name: 'movil-xs', width: 320, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const OUT = 'scripts/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
let problemas = 0;

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const errores = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') errores.push(m.text());
    });
    page.on('pageerror', (e) => errores.push('PAGEERROR: ' + e.message));
    // El texto de consola no dice qué recurso falló; la respuesta sí.
    page.on('response', (r) => {
      if (r.status() >= 400) errores.push(`${r.status()} → ${r.url()}`);
    });
    page.on('requestfailed', (r) =>
      errores.push(`REQFAIL → ${r.url()} (${r.failure()?.errorText})`)
    );

    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
      // El preloader dura 800ms; esperamos a que termine antes de medir.
      await new Promise((r) => setTimeout(r, 2500));
    } catch (e) {
      console.log(`! ${vp.name.padEnd(9)} ${route.padEnd(15)} navegación falló: ${e.message}`);
      problemas++;
      await page.close().catch(() => {});
      continue;
    }

    // Un scrollWidth mayor no implica scroll real: con overflow-x:hidden el
    // DOM lo reporta igual pero el usuario no puede desplazarse. Medimos si
    // la página se mueve de verdad.
    const scrollReal = await page.evaluate(() => {
      window.scrollTo(500, 0);
      const x = window.scrollX;
      window.scrollTo(0, 0);
      return x;
    });

    const overflow = await page.evaluate(() => {
      const d = document.documentElement;
      const culpables = [];
      if (d.scrollWidth > d.clientWidth) {
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > d.clientWidth + 1 || r.left < -1) {
            culpables.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} (right=${Math.round(r.right)})`
            );
            if (culpables.length >= 3) break;
          }
        }
      }
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, culpables };
    });

    const etiqueta = `${vp.name.padEnd(9)} ${route.padEnd(15)}`;
    // Solo cuenta como fallo si el usuario puede desplazarse de verdad.
    const desborda = scrollReal > 0;
    const relevantes = errores.filter(
      (e) =>
        // _vercel/* solo existe desplegado en Vercel: en local siempre da 404.
        // El mensaje genérico de consola no trae URL; su origen son esos
        // mismos scripts (verificado con el listener de `response`).
        !/favicon|Download the React DevTools|_vercel|speed-insights|challenges\.cloudflare|Failed to load resource|%c%d/i.test(
          e
        )
    );

    if (desborda || relevantes.length) {
      problemas++;
      console.log(`✗ ${etiqueta}`);
      if (desborda) {
        console.log(`    overflow: ${overflow.scrollWidth}px > ${overflow.clientWidth}px`);
        overflow.culpables.forEach((c) => console.log(`      - ${c}`));
      }
      relevantes.slice(0, 4).forEach((e) => console.log(`    consola: ${e.slice(0, 160)}`));
    } else {
      console.log(`✓ ${etiqueta}`);
    }

    await page.screenshot({
      path: `${OUT}/${vp.name}${route.replace(/\//g, '_') || '_home'}.png`
    });
    await page.close();
  }
}

await browser.close();
console.log(problemas ? `\n${problemas} combinaciones con problemas` : '\nTodo limpio');
