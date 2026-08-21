// Comprueba que la preview de /projects no se salga del viewport al pasar el
// cursor por los proyectos, sobre todo los de abajo.
// Uso: node scripts/check-modal.mjs [baseUrl]
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

const enlaces = await page.evaluate(() =>
  [...document.querySelectorAll('h2, h3, p')]
    .filter((e) => e.className && String(e.className).includes('cursor-pointer'))
    .length
);

// Recorremos la lista de proyectos de arriba abajo.
const cajas = await page.evaluate(() => {
  const filas = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect();
    return r.height > 80 && r.height < 220 && r.width > 800;
  });
  return filas.map((d) => {
    const r = d.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
});

let fuera = 0;
for (const [i, c] of cajas.entries()) {
  if (c.y < 0 || c.y > 900) continue;
  await page.mouse.move(c.x, c.y, { steps: 8 });
  await new Promise((r) => setTimeout(r, 900));

  const info = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find((d) => {
      const s = getComputedStyle(d);
      return d.className.includes('w-[400px]') && s.transform !== 'none';
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      vh: window.innerHeight,
      vw: window.innerWidth,
      visible: r.width > 10
    };
  });

  if (!info || !info.visible) continue;

  const desborda =
    info.top < -1 || info.bottom > info.vh + 1 || info.left < -1 || info.right > info.vw + 1;
  if (desborda) fuera++;
  console.log(
    `  fila ${String(i).padStart(2)} y=${String(Math.round(c.y)).padStart(3)}  ` +
      `modal top=${String(info.top).padStart(5)} bottom=${String(info.bottom).padStart(5)} ` +
      `(viewport ${info.vh})  ${desborda ? '✗ SE SALE' : '✓'}`
  );
}

await browser.close();
console.log(fuera ? `\n${fuera} posiciones con desbordamiento` : '\nEl modal nunca se sale');
