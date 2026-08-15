import React, { PropsWithChildren, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children }: PropsWithChildren<any>) {
  const magnetic = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = magnetic.current;
    if (!element) return;

    // Sin puntero fino (móvil/tablet) el efecto no aplica y además evita
    // registrar listeners que nunca se disparan.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const xTo = gsap.quickTo(element, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)'
    });
    const yTo = gsap.quickTo(element, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)'
    });

    // El centro se mide una vez al entrar, no en cada mousemove.
    // getBoundingClientRect fuerza un reflow sincrónico, y además devolvía el
    // rect YA desplazado por GSAP, así que el desplazamiento se retroalimentaba.
    let centerX = 0;
    let centerY = 0;

    const measure = () => {
      const { height, width, left, top } = element.getBoundingClientRect();
      const current = gsap.getProperty(element) as (p: string) => number;
      centerX = left + width / 2 - (current('x') || 0);
      centerY = top + height / 2 - (current('y') || 0);
    };

    const handleMouseEnter = () => measure();

    const handleMouseMove = (e: MouseEvent) => {
      xTo((e.clientX - centerX) * 0.4);
      yTo((e.clientY - centerY) * 0.4);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, []);

  // `ref` no está en el tipo de props de cloneElement bajo `strict`, y el hijo
  // puede ser cualquier elemento: se mantiene el cast laxo del original.
  if (!React.isValidElement(children)) return <>{children}</>;

  return React.cloneElement(children as any, { ref: magnetic });
}
