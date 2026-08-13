'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { clsx } from 'clsx';
import { isMobile } from '@/components/util';

type BlurCursorProps = {
  isActive?: boolean;
  text?: string;
};

export default function ContrastCursor({ isActive, text }: BlurCursorProps) {
  const [isClicked, setIsClicked] = useState(false);
  // El servidor no conoce el dispositivo: renderizaba siempre el cursor y en
  // móvil el cliente devolvía null, provocando un mismatch de hidratación.
  const [enabled, setEnabled] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Sin puntero fino no hay cursor que sustituir: en táctil se evita montar
    // el componente y registrar tres listeners que nunca se disparan.
    if (isMobile() || !window.matchMedia('(pointer: fine)').matches) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      className={clsx(
        'pointer-events-none fixed left-0 top-0 z-50 mix-blend-multiply shadow-md',
        isActive
          ? 'w-400 bg-destructive bg-opacity-50 p-4 text-6xl font-bold text-white'
          : 'h-10 w-10 rounded-full',
        isClicked ? 'bg-[#16db65]' : 'bg-[#16db65]'
      )}
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring
      }}
    >
      {isActive && text}
    </motion.div>
  );
}
