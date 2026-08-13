import { NextResponse } from 'next/server';
import { spotifyFetch, toPublicError } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

const DEFAULT_PLAYLIST_ID = '2lk45v8v1wBksvfiqZzC8x';

type PlaylistResponse = {
  id: string;
  name: string;
  description: string | null;
  images: Array<{ url: string }> | null;
  tracks: { total: number };
  external_urls: { spotify: string };
  public: boolean | null;
  owner: { display_name?: string | null };
};

type TracksResponse = {
  items: Array<{
    track: {
      name: string;
      artists: Array<{ name: string }>;
    } | null;
  }>;
};

export async function GET() {
  const playlistId = process.env.SPOTIFY_PLAYLIST_ID || DEFAULT_PLAYLIST_ID;

  try {
    const [playlist, tracks] = await Promise.all([
      spotifyFetch<PlaylistResponse>(`/playlists/${playlistId}`),
      spotifyFetch<TracksResponse>(`/playlists/${playlistId}/tracks`, {
        limit: 1
      })
    ]);

    const firstTrack = tracks.items[0]?.track;

    return NextResponse.json([
      {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description ?? '',
        imageUrl: playlist.images?.[0]?.url ?? null,
        trackCount: playlist.tracks.total,
        firstTrack: firstTrack?.name ?? 'Sin canciones',
        firstTrackArtist: firstTrack?.artists?.[0]?.name ?? 'Artista desconocido',
        url: playlist.external_urls.spotify,
        isPublic: playlist.public ?? false,
        owner: playlist.owner.display_name ?? ''
      }
    ]);
  } catch (error) {
    const { message, status } = toPublicError(error);
    console.error('[spotify-playlists]', error);
    return NextResponse.json({ error: message }, { status });
  }
}
