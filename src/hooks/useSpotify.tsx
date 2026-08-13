'use client';

import { useEffect, useState } from 'react';

export interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  url: string;
}

export interface SpotifyArtist {
  name: string;
  url: string;
  images: Array<{ url: string; height: number | null; width: number | null }>;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  trackCount: number;
  firstTrack: string;
  firstTrackArtist: string;
  url: string;
}

export const useSpotify = () => {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  // Un contador por petición: antes ambos fetches compartían un único
  // `isLoading` y el primero en terminar apagaba el spinner del otro.
  const [pending, setPending] = useState(2);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const load = async <T,>(url: string, apply: (data: T) => void) => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? `La petición a ${url} falló`);
        }
        const data = (await response.json()) as T;
        if (active) apply(data);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      } finally {
        if (active) setPending((count) => count - 1);
      }
    };

    load<SpotifyPlaylist[]>('/api/spotify-playlists', setPlaylists);
    load<{ topTracks: SpotifyTrack[]; topArtists: SpotifyArtist[] }>(
      '/api/spotify-top-tracks',
      (data) => {
        setTopTracks(data.topTracks ?? []);
        setTopArtists(data.topArtists ?? []);
      }
    );

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { topTracks, topArtists, playlists, isLoading: pending > 0, error };
};
