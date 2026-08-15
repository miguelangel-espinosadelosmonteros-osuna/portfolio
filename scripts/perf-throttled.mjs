// Mide fluidez con la CPU ralentizada, que es donde se nota el trabajo extra
// por frame. Uso: node scripts/perf-throttled.mjs [baseUrl] [factor]
import puppeteer from 'puppeteer';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const RATE = Number(process.argv[3] ?? 6);

const browser = await puppeteer.launch({ headless: 'new' });

for (const route of ['/', '/about']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });

  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3500));

  const stats = await page.evaluate(
    () =>
      new Promise((res) => {
        let frames = 0;
        let long = 0;
        let worst = 0;
        let last = performance.now();
        const t0 = last;
        const tick = () => {
          const now = performance.now();
          const d = now - last;
          frames++;
          if (d > 50) long++;
          if (d > worst) worst = d;
          last = now;
          if (now - t0 < 4000) requestAnimationFrame(tick);
          else res({ frames, long, worst, dur: now - t0 });
        };
        requestAnimationFrame(tick);
      })
  );

  const fps = (stats.frames / (stats.dur / 1000)).toFixed(1);
  console.log(
    `  ${route.padEnd(9)} fps≈${String(fps).padStart(5)}  frames_largos=${String(stats.long).padStart(3)}  peor=${stats.worst.toFixed(0)}ms`
  );

  await page.close();
}

await browser.close();
