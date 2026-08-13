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

    const handleMouseMove = (e: MouseEvent) => {
      const { height, width, left, top } = element.getBoundingClientRect();
      xTo((e.clientX - (left + width / 2)) * 0.4);
      yTo((e.clientY - (top + height / 2)) * 0.4);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
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
