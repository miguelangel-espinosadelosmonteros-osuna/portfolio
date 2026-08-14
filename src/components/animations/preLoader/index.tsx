'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { opacity, slideUp } from '@/components/animations/preLoader/anim';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';

// Clases completas: `bg-${colour}` es interpolado y Tailwind lo purga al
// compilar, así que el punto nunca llegaba a tener color.
const words = [
  { text: 'Hola', dot: 'bg-primary', label: 'text-primary' },
  { text: 'Hello', dot: 'bg-secondary', label: 'text-secondary' },
  { text: 'Salut', dot: 'bg-accent', label: 'text-accent' },
  { text: 'Bonjour', dot: 'bg-destructive', label: 'text-destructive' },
  { text: 'Ciao', dot: 'bg-purple-500', label: 'text-purple-500' }
];

export default function PreLoader() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const pathname = usePathname()?.split('/').pop() || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (index === words.length - 1) return;
    
    const timer = setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 1000 : 150
    );

    return () => clearTimeout(timer);
  }, [index, mounted]);

  if (!mounted) return null;

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed z-30 flex h-screen w-screen items-center justify-center bg-black text-white"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className={clsx(
              'absolute flex items-center justify-center text-4xl',
              words[index].label
            )}
          >
            {/* `size-3` requiere Tailwind 3.4; el proyecto usa 3.3.3. */}
            <span
              className={clsx(
                'mr-3 block h-3 w-3 rounded-full',
                words[index].dot
              )}
            ></span>
            {pathname === '' ? words[index].text : pathname}
          </motion.p>
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full fill-[#141516]">
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
