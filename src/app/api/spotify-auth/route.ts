import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read',
  'user-library-read'
];

export async function GET() {
  // Utilidad de un solo uso para generar el refresh token. Exponerla en
  // producción permite a cualquiera iniciar el flujo OAuth de esta app.
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Faltan SPOTIFY_CLIENT_ID o SPOTIFY_REDIRECT_URI' },
      { status: 503 }
    );
  }

  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', SCOPES.join(' '));
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', crypto.randomUUID());

  return NextResponse.redirect(url);
}
