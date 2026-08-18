import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

type RecentlyPlayed = {
  items: Array<{
    played_at: string;
    track: {
      name: string;
      artists: Array<{ name: string }>;
      album: { images: Array<{ url: string; width: number }> | null };
      external_urls: { spotify: string };
    };
  }>;
};

const ANCHO = 400;
const ALTO_FILA = 60;
const CARATULA = 44;

/** Escapa el texto: un título con & o < rompería el SVG. */
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function recortar(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/**
 * GitHub sirve las imágenes del README a través de su proxy (Camo), que no
 * resuelve imágenes externas anidadas dentro de un SVG. Las carátulas hay que
 * incrustarlas como data URI o saldrían huecos en blanco.
 */
async function comoDataUri(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const tipo = r.headers.get('content-type') ?? 'image/jpeg';
    return `data:${tipo};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function svgError(mensaje: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="60" viewBox="0 0 ${ANCHO} 60" role="img" aria-label="${esc(mensaje)}">
  <rect width="${ANCHO}" height="60" rx="10" fill="#121212"/>
  <text x="20" y="35" font-family="Segoe UI,Ubuntu,sans-serif" font-size="13" fill="#b3b3b3">${esc(mensaje)}</text>
</svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(Math.max(Number(searchParams.get('count') ?? 3), 1), 5);

  try {
    const datos = await spotifyFetch<RecentlyPlayed>(
      '/me/player/recently-played',
      { limit: Math.min(count * 4, 50) }
    );

    // El historial repite canciones; nos quedamos con la primera aparición.
    const vistos = new Set<string>();
    const pistas = [];
    for (const item of datos.items) {
      const clave = `${item.track.name}|${item.track.artists[0]?.name}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      pistas.push(item.track);
      if (pistas.length === count) break;
    }

    const caratulas = await Promise.all(
      pistas.map((t) =>
        comoDataUri(
          [...(t.album.images ?? [])].sort((a, b) => a.width - b.width)[0]?.url
        )
      )
    );

    const alto = 16 + pistas.length * ALTO_FILA;

    const filas = pistas
      .map((t, i) => {
        const y = 8 + i * ALTO_FILA;
        const img = caratulas[i]
          ? `<image x="12" y="${y + 4}" width="${CARATULA}" height="${CARATULA}" href="${caratulas[i]}" clip-path="inset(0 round 4)"/>`
          : `<rect x="12" y="${y + 4}" width="${CARATULA}" height="${CARATULA}" rx="4" fill="#282828"/>`;
        return `${img}
  <text x="${12 + CARATULA + 12}" y="${y + 24}" font-family="Segoe UI,Ubuntu,sans-serif" font-size="13" font-weight="600" fill="#ffffff">${esc(recortar(t.name, 34))}</text>
  <text x="${12 + CARATULA + 12}" y="${y + 42}" font-family="Segoe UI,Ubuntu,sans-serif" font-size="12" fill="#b3b3b3">${esc(recortar(t.artists.map((a) => a.name).join(', '), 40))}</text>`;
      })
      .join('\n  ');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${alto}" viewBox="0 0 ${ANCHO} ${alto}" role="img" aria-label="Canciones escuchadas recientemente en Spotify">
  <title>Escuchado recientemente en Spotify</title>
  <rect width="${ANCHO}" height="${alto}" rx="10" fill="#121212"/>
  ${filas}
</svg>`;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        // Camo cachea igualmente, pero esto evita que quede congelado días.
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('[spotify-recent]', error);
    return new NextResponse(svgError('Spotify no disponible ahora mismo'), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }
}
