import { NextResponse } from 'next/server';
import { spotifyFetch, toPublicError } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

type SpotifyImage = { url: string; height: number | null; width: number | null };

type TopArtistsResponse = {
  items: Array<{
    name: string;
    external_urls: { spotify: string };
    images: SpotifyImage[] | null;
  }>;
};

type TopTracksResponse = {
  items: Array<{
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string; images: SpotifyImage[] | null };
    external_urls: { spotify: string };
  }>;
};

export async function GET() {
  try {
    const [topArtists, topTracks] = await Promise.all([
      spotifyFetch<TopArtistsResponse>('/me/top/artists', { limit: 25 }),
      spotifyFetch<TopTracksResponse>('/me/top/tracks', { limit: 25 })
    ]);

    return NextResponse.json({
      topArtists: topArtists.items.map((artist) => ({
        name: artist.name,
        url: artist.external_urls.spotify,
        images: artist.images ?? []
      })),
      topTracks: topTracks.items.map((track) => ({
        name: track.name,
        artist: track.artists[0]?.name ?? 'Artista desconocido',
        album: track.album.name,
        url: track.external_urls.spotify,
        albumArt: track.album.images?.[0]?.url ?? null
      }))
    });
  } catch (error) {
    const { message, status } = toPublicError(error);
    console.error('[spotify-top-tracks]', error);
    return NextResponse.json({ error: message }, { status });
  }
}
