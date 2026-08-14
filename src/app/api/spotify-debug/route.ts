import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Endpoint TEMPORAL de diagnóstico. Solo devuelve metadatos del formato de las
 * variables (longitud, comillas, espacios) y el código de error de Spotify.
 * Nunca el contenido de una credencial. Bórralo cuando Spotify funcione.
 */
function inspect(name: string) {
  const raw = process.env[name];
  if (raw === undefined) return { presente: false };

  return {
    presente: true,
    longitud: raw.length,
    // Causa habitual: copiar el valor del .env con las comillas incluidas.
    comillas: /^["'].*["']$/.test(raw),
    espaciosAlrededor: raw !== raw.trim(),
    saltoDeLinea: /[\r\n]/.test(raw)
  };
}

export async function GET() {
  const vars = [
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET',
    'SPOTIFY_REFRESH_TOKEN',
    'SPOTIFY_PLAYLIST_ID'
  ];

  const variables = Object.fromEntries(vars.map((v) => [v, inspect(v)]));

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;

  let spotify: Record<string, unknown> = { probado: false };

  if (id && secret && refresh) {
    try {
      const r = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh
        }),
        cache: 'no-store'
      });

      const body: any = await r.json().catch(() => ({}));
      spotify = {
        probado: true,
        status: r.status,
        // invalid_client -> fallan id/secret. invalid_grant -> refresh token.
        codigo: body?.error ?? null,
        descripcion: body?.error_description ?? null
      };
    } catch (e) {
      spotify = { probado: true, fallo: (e as Error).message };
    }
  }

  return NextResponse.json(
    { variables, spotify, entorno: process.env.VERCEL_ENV ?? 'local' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
