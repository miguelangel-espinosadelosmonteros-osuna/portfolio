// Mide bytes transferidos y tiempo hasta que la página queda utilizable.
// Uso: node scripts/perf-bytes.mjs [baseUrl]
import puppeteer from 'puppeteer';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({ headless: 'new' });

for (const route of ['/', '/about']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  const porTipo = {};
  let total = 0;

  page.on('response', async (res) => {
    try {
      const len = Number(res.headers()['content-length'] ?? 0);
      const tipo = (res.headers()['content-type'] ?? 'otro').split(';')[0];
      const grupo = tipo.startsWith('image/')
        ? 'imagenes'
        : tipo.includes('javascript')
          ? 'js'
          : tipo.includes('css')
            ? 'css'
            : 'otro';
      porTipo[grupo] = (porTipo[grupo] ?? 0) + len;
      total += len;
    } catch {}
  });

  const t0 = Date.now();
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 });
  const carga = Date.now() - t0;

  const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
  console.log(`  ${route.padEnd(8)} total=${mb(total).padStart(9)}  imagenes=${mb(porTipo.imagenes ?? 0).padStart(9)}  js=${mb(porTipo.js ?? 0).padStart(9)}  carga=${carga}ms`);

  await page.close();
}

await browser.close();
