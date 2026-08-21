// Reproduce el bug reportado: al scrollear y volver a mover el ratón, la
// preview saltaba a una esquina. Alterna además entre proyectos con y sin
// enlace, que es lo que provocaba el remontaje.
// Uso: node scripts/check-modal-scroll.mjs [baseUrl]
import puppeteer from 'puppeteer';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 180000,
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE + '/projects', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));

const leer = () =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(
      (d) => d.className.includes('w-[400px]') && d.className.includes('h-[350px]')
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      cx: Math.round(r.left + r.width / 2),
      cy: Math.round(r.top + r.height / 2),
      t: Math.round(r.top),
      b: Math.round(r.bottom),
      l: Math.round(r.left),
      rr: Math.round(r.right),
      vh: innerHeight,
      vw: innerWidth
    };
  });

let fallos = 0;

// Recorre la lista alternando filas y scrolleando entre medias.
for (const [paso, sy] of [[1, 0], [2, 300], [3, 700], [4, 200], [5, 900]].entries()) {
  await page.evaluate((y) => window.scrollTo(0, y), sy[1]);
  await new Promise((r) => setTimeout(r, 700));

  for (const cy of [300, 600, 820]) {
    await page.mouse.move(720, cy, { steps: 10 });
    await new Promise((r) => setTimeout(r, 1200));
    const o = await leer();
    if (!o) continue;

    // ¿Sigue al cursor? (con la tolerancia del acotado en los bordes)
    const desvX = Math.abs(o.cx - 720);
    const acotadoY = Math.min(Math.max(cy, 175 + 12), o.vh - 175 - 12);
    const desvY = Math.abs(o.cy - acotadoY);
    const fuera = o.t < -1 || o.b > o.vh + 1 || o.l < -1 || o.rr > o.vw + 1;
    const mal = fuera || desvX > 25 || desvY > 25;
    if (mal) fallos++;

    console.log(
      `  scroll=${String(sy[1]).padStart(3)} cursorY=${String(cy).padStart(3)} -> ` +
        `centro=(${String(o.cx).padStart(4)},${String(o.cy).padStart(4)}) ` +
        `desv=(${String(desvX).padStart(3)},${String(desvY).padStart(3)}) ` +
        `${fuera ? 'FUERA ' : ''}${mal ? '✗' : '✓'}`
    );
  }
}

await browser.close();
console.log(fallos ? `\n${fallos} fallos` : '\nLa preview sigue al cursor y nunca se sale');
