// Mide fluidez real: frames largos y FPS durante un scroll simulado.
// Uso: node scripts/perf-scroll.mjs [baseUrl]
import puppeteer from 'puppeteer';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const ROUTES = ['/', '/about', '/projects'];

const browser = await puppeteer.launch({ headless: 'new' });

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500)); // preloader

  // Contamos frames y detectamos los que tardan más de 50ms (jank visible).
  await page.evaluate(() => {
    window.__stats = { frames: 0, long: 0, worst: 0 };
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = now - last;
      const s = window.__stats;
      s.frames++;
      if (delta > 50) s.long++;
      if (delta > s.worst) s.worst = delta;
      last = now;
      window.__raf = requestAnimationFrame(tick);
    };
    window.__raf = requestAnimationFrame(tick);
  });

  const start = Date.now();
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel({ deltaY: 120 });
    await new Promise((r) => setTimeout(r, 50));
  }
  const elapsed = (Date.now() - start) / 1000;

  const stats = await page.evaluate(() => {
    cancelAnimationFrame(window.__raf);
    return window.__stats;
  });

  const fps = (stats.frames / elapsed).toFixed(1);
  console.log(
    `${route.padEnd(12)} fps≈${String(fps).padStart(5)}  ` +
      `frames_largos=${String(stats.long).padStart(3)}  ` +
      `peor_frame=${stats.worst.toFixed(0)}ms`
  );

  await page.close();
}

await browser.close();
