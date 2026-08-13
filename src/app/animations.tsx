'use client';
import React, { PropsWithChildren, useEffect } from 'react';

export default function Animations({ children }: PropsWithChildren<{}>) {
  useEffect(() => {
    // Respetamos la preferencia del sistema: con "reducir movimiento" activo,
    // el scroll suavizado marea y no aporta nada.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let instance: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      // @ts-ignore
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      if (cancelled) return;
      instance = new LocomotiveScroll();
    })();

    return () => {
      // Sin esto la instancia queda viva con sus listeners de scroll y su
      // propio bucle RAF tras cada navegación.
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  return <div className="main">{children}</div>;
}
