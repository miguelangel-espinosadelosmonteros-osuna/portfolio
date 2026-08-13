import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Igual que /api/spotify-auth: solo es una utilidad de desarrollo.
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Faltan credenciales de Spotify en el entorno' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  const code = searchParams.get('code');

  if (error) {
    return NextResponse.json(
      { error: `Autorización rechazada: ${error}` },
      { status: 400 }
    );
  }
  if (!code) {
    return NextResponse.json(
      { error: 'No se recibió el código de autorización' },
      { status: 400 }
    );
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }),
    cache: 'no-store'
  });

  if (!response.ok) {
    console.error('[spotify-callback]', await response.text().catch(() => ''));
    return NextResponse.json(
      { error: 'No se pudo canjear el código por un token' },
      { status: 502 }
    );
  }

  const { refresh_token: refreshToken } = (await response.json()) as {
    refresh_token?: string;
  };

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Spotify no devolvió un refresh token' },
      { status: 502 }
    );
  }

  // Devolvemos JSON en vez de HTML: no hay interpolación de secretos en markup
  // y la respuesta no se puede renderizar como página en un navegador ajeno.
  return NextResponse.json(
    {
      message:
        'Copia este valor en SPOTIFY_REFRESH_TOKEN (.env.local y variables de Vercel).',
      refreshToken
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
