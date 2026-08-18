'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image, { StaticImageData } from 'next/image';
import { clsx } from 'clsx';

interface HeroSectionProps {
  description: string;
  title: string;
  isImage: boolean;
  media: string | StaticImageData;
  bgColour?: string;
  /**
   * Portada y enlace externo para vídeos que no se pueden embeber (el dueño
   * del vídeo tiene el embebido desactivado y player.vimeo.com responde 401).
   * Se muestra la portada a pantalla completa y se enlaza al vídeo original.
   */
  posterSrc?: string | StaticImageData;
  videoHref?: string;
}

export default function ProjectHero({
  description,
  title,
  isImage,
  media,
  bgColour,
  posterSrc,
  videoHref
}: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const usaPortada = !isImage && !!videoHref && !!posterSrc;

  const getVideoSrc = () => {
    const src = String(media);
    if (src.includes('vimeo')) {
      return `${src}?autoplay=1&muted=1&loop=1&color=E73C39&title=0&portrait=0&background=1#t=1m33s`;
    }
    return `${src}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${src.split('/').pop()}`;
  };

  return (
    <div
      className={clsx(
        'relative',
        isImage ? 'h-[60vh] lg:h-screen' : 'h-screen',
        // Clase completa, no interpolada: Tailwind purga `bg-${bgColour}`
        // porque no puede verla en el código al compilar.
        bgColour ?? 'bg-black'
      )}
    >
      {isImage ? (
        <div className="flex w-full justify-center">
          <Image
            className="h-auto w-[80vw] pt-12 "
            width="300"
            height="300"
            src={media}
            quality={100}
            alt="project image"
          />
        </div>
      ) : usaPortada ? (
        <Image
          src={posterSrc!}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <iframe
          src={getVideoSrc()}
          className="aspect-video h-full w-full"
          allow="accelerometer; autoplay; modestbranding; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      )}
      {!isImage && (
        <div className="absolute bottom-0 left-0 h-[60vh] w-full bg-gradient-to-b from-transparent to-foreground"></div>
      )}
      {usaPortada && (
        <a
          href={videoHref}
          target="_blank"
          rel="noopener noreferrer"
          // En móvil `bottom-32` caía justo encima del título; se sube al
          // hueco libre bajo la cabecera y solo baja a partir de sm.
          className="absolute right-4 top-20 z-10 inline-flex items-center gap-2 rounded bg-white/90 px-3 py-1.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-white sm:bottom-16 sm:right-6 sm:top-auto"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
          Ver vídeo
        </a>
      )}
      {!isImage && !usaPortada && (
        <Button
          className="absolute right-4 top-20 z-10 h-8 rounded px-3 sm:bottom-16 sm:right-6 sm:top-auto"
          onClick={toggleMute}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      )}
      <div
        className={clsx(
          // `left-12 w-full` hacía el bloque 3rem más ancho que el viewport;
          // con inset-x el texto queda dentro en cualquier pantalla.
          'absolute flex inset-x-6 sm:inset-x-12',
          isImage ? 'bottom-12' : 'bottom-4 sm:bottom-16'
        )}
      >
        <div className="flex max-w-xs flex-col gap-4 sm:max-w-4xl sm:gap-6">
          <h1 className="text-2xl font-medium tracking-tight text-background mix-blend-difference sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="text-xs text-background mix-blend-difference sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
