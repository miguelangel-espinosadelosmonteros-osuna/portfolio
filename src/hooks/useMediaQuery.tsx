'use client';
import { useEffect, useState } from 'react';

/**
 * Devuelve `false` en el primer render (servidor y cliente coinciden) y se
 * sincroniza tras montar. La versión anterior incluía `matches` en las
 * dependencias, así que se desuscribía y resuscribía en cada cambio.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
