'use client';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform
} from 'framer-motion';
import ContactInfo from '@/components/home/ContactInfo';
import { isMobile } from '@/components/util';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import PreLoader from '@/components/animations/preLoader';

export default function RootTemplate({ children }: PropsWithChildren) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  const input = isMobile() ? 0.95 : 1.0;
  const height = useTransform(scrollYProgress, [0, input], [100, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname().split('/').pop();

  let bgColour = 'bg-background';
  let semicircleColor = 'bg-background';
  const darkModeScreens = ['gallery', 'contact', 'aps', 'astra'];
  if (darkModeScreens.includes(pathname!)) {
    bgColour = 'bg-foreground';
    semicircleColor = 'bg-foreground';
  } else if (pathname === 'about') {
    bgColour = 'bg-gradient-to-b from-[#a8e6cf] via-[#dcedc1] to-[#e8f3dc]';
    semicircleColor = 'bg-[#e8f3dc]';
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <PreLoader />}
      </AnimatePresence>
      <div ref={container} className={clsx('relative z-10', bgColour)}>
        {children}
        <motion.div style={{ height }} className="relative">
          <div
            className={clsx(
              // will-change promueve la capa para que la sombra se rasterice
              // una vez en lugar de repintarse en cada frame del scroll.
              'absolute left-[-10%] z-10 h-[1050%] w-[120%] rounded-b-[100%] shadow-[0_60px_50px_0px_rgba(0,0,0,0.748)] will-change-transform',
              semicircleColor
            )}
          ></div>
        </motion.div>
      </div>
      <ContactInfo />
    </main>
  );
}
