import React from 'react';
import Image from 'next/image';

// Interfaz para la estructura de una playlist de Spotify
interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  trackCount: number;
  firstTrack: string;
  firstTrackArtist: string;
  url: string;
}

// Props que recibe el componente
interface SpotifyPlaylistsProps {
  playlists: SpotifyPlaylist[];
}

const SpotifyPlaylists: React.FC<SpotifyPlaylistsProps> = ({ playlists }) => {
  // Obtener el ID de la primera playlist si existe
  const mainPlaylistId = playlists[0]?.id;

  return (
    <div className="rounded-3xl bg-[#1DB954]/90 p-6 text-white shadow-lg h-full flex flex-col">
      <h3 className="mb-6 text-3xl font-bold text-white text-center">
        Mis canciones más escuchadas
      </h3>
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-1 lg:gap-4 lg:flex-1">
        {mainPlaylistId && (
          <div className="h-96 w-full overflow-hidden rounded-lg lg:h-auto lg:aspect-square">
            <iframe
              title="Mi Playlist de Spotify"
              src={`https://open.spotify.com/embed/playlist/${mainPlaylistId}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              style={{ minHeight: '100%', border: 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}
        <div className="w-full rounded-lg bg-white/10 p-6 lg:aspect-square">
          {playlists.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 flex w-full flex-col items-center rounded-md bg-white/20 p-4 transition-all duration-300 hover:bg-white/30"
            >
              {playlist.imageUrl && (
                <div className="relative mb-4 aspect-square w-full max-w-xs">
                  <Image
                    src={playlist.imageUrl}
                    alt={`Portada de ${playlist.name}`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 320px"
                    className="rounded-lg object-cover shadow-xl"
                  />
                </div>
              )}
              <div className="flex w-full flex-col items-center text-center">
                <h4 className="mb-2 text-xl font-bold text-white">
                  {playlist.name}
                </h4>
              </div>
            </a>
          ))}
          <p className="mt-4 text-center text-base text-white/90">
            Mi gusto musical refleja mi personalidad ecléctica: desde el indie alternativo de The Marías y Steve Lacy hasta el art pop de Gorillaz. Me apasiona especialmente la música que combina elementos del dream pop con ritmos electrónicos, siempre buscando sonidos que evoquen atmósferas únicas e inspiren mi proceso creativo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlaylists;
