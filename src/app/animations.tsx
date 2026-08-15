'use client';
import React, { PropsWithChildren, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Animations({ children }: PropsWithChildren<{}>) {
  useEffect(() => {
    // Con "reducir movimiento" activo el scroll suavizado marea y no aporta.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5
    });

    // Antes: locomotive-scroll (5.0.0-beta) movía el scroll por su cuenta
    // mientras siete componentes con ScrollTrigger leían la posición nativa,
    // cada uno actualizándose en un frame distinto. De ahí el desfase.
    // Ahora ScrollTrigger se actualiza en el mismo evento que el scroll...
    lenis.on('scroll', ScrollTrigger.update);

    // ...y Lenis avanza dentro del ticker de GSAP, de modo que scroll y
    // animaciones comparten un único requestAnimationFrame por frame.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);

    // lagSmoothing hace que GSAP "salte" tras un frame lento para recuperar
    // el tiempo perdido, lo que con scroll suavizado se percibe como un tirón.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return <div className="main">{children}</div>;
}
