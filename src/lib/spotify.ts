// Solo debe importarse desde route handlers / server components.
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

export class SpotifyConfigError extends Error {}
export class SpotifyApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

type SpotifyEnv = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

/**
 * Lee y valida las credenciales. Lanza SpotifyConfigError con la lista de
 * variables faltantes en lugar de fallar más tarde con un error opaco de red.
 */
export function getSpotifyEnv(): SpotifyEnv {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const missing = [
    !clientId && 'SPOTIFY_CLIENT_ID',
    !clientSecret && 'SPOTIFY_CLIENT_SECRET',
    !refreshToken && 'SPOTIFY_REFRESH_TOKEN'
  ].filter(Boolean);

  if (missing.length) {
    throw new SpotifyConfigError(
      `Faltan variables de entorno: ${missing.join(', ')}`
    );
  }

  return {
    clientId: clientId!,
    clientSecret: clientSecret!,
    refreshToken: refreshToken!
  };
}

// El access token de Spotify dura 1h. Lo cacheamos en memoria del worker para
// no gastar una llamada de refresh en cada request. `inFlight` evita que varias
// peticiones concurrentes disparen refreshes simultáneos.
let cachedToken: { value: string; expiresAt: number } | null = null;
let inFlight: Promise<string> | null = null;

const EXPIRY_MARGIN_MS = 60_000;

async function requestAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = getSpotifyEnv();

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }),
    cache: 'no-store'
  });

  if (!response.ok) {
    // Spotify devuelve un código estable (`invalid_client` si fallan
    // id/secret, `invalid_grant` si el refresh token está revocado). No
    // contiene credenciales, así que sirve para diagnosticar desde los logs.
    const code = await response
      .json()
      .then((b: any) => b?.error ?? 'desconocido')
      .catch(() => 'ilegible');

    throw new SpotifyApiError(
      `No se pudo renovar el access token de Spotify (${response.status} ${code})`,
      response.status === 400 || response.status === 401 ? 401 : 502
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - EXPIRY_MARGIN_MS
  };

  return data.access_token;
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }
  if (!inFlight) {
    inFlight = requestAccessToken().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

/** GET autenticado contra la Web API, con un reintento si el token caducó. */
export async function spotifyFetch<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const call = async (token: string) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

  let response = await call(await getAccessToken());

  if (response.status === 401) {
    cachedToken = null;
    response = await call(await getAccessToken());
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new SpotifyApiError(
      `Spotify respondió ${response.status} en ${path}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      response.status
    );
  }

  return (await response.json()) as T;
}

/** Traduce cualquier error interno a un status HTTP seguro para el cliente. */
export function toPublicError(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof SpotifyConfigError) {
    return { message: 'Integración de Spotify no configurada', status: 503 };
  }
  if (error instanceof SpotifyApiError) {
    const status = error.status >= 400 && error.status <= 599 ? error.status : 502;
    // 401/403 hacia Spotify es un fallo de configuración nuestro, no del visitante.
    return {
      message: 'No se pudo obtener información de Spotify',
      status: status === 401 || status === 403 ? 503 : status
    };
  }
  return { message: 'Error inesperado al consultar Spotify', status: 502 };
}
