'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import SlidingImages from '@/components/home/SlidingImages';
import ContrastCursor from '@/components/animations/cursor/contrastCursor';
import dynamic from 'next/dynamic';
import Magnetic from '@/components/animations/magnetic';
import Hero from '@/components/home/hero';
import Description from '@/components/home/Description/description';

const LetterCollision = dynamic(
  () =>
    import('@/components/animations/textAnimations/scrollText').then(
      (mod) => mod.LetterCollision
    ),
  { ssr: false }
);

const slider1 = [
  {
    color: 'white',
    src: 'HemodialisisRenal/Mike2.png'
  },
  {
    color: 'white',
    src: 'mockups/mockup2.png'
  },
  {
    color: '#21242b',
    src: 'mockups/mockup3.png'
  },
  {
    color: '#21242b',
    src: 'aps/APS1.jpg'
  }
];
const slider2 = [
  {
    color: '#d4e3ec',
    src: 'aps/APS2.png'
  },
  {
    color: '#9289BD',
    src: 'mockups/mockup.png'
  },
  {
    color: 'white',
    src: 'aps/APS3.png'
  },
  {
    color: 'white',
    src: 'HemodialisisRenal/Mike1.png'
  }
];

export default function Home() {
  const [showScrollButton, setShowScrollButton] = useState(true);
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window?.scrollY > 0) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    };

    // passive: el navegador no tiene que esperar a saber si haremos
    // preventDefault, así el scroll no se bloquea en el hilo principal.
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToHero = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={scrollContainerRef}>
      <LetterCollision />
      {showScrollButton && (
        <Magnetic>
          <div
            className="fixed bottom-4 right-8 hidden cursor-pointer items-center space-x-2 text-3xl font-semibold sm:bottom-8 md:flex"
            onClick={scrollToHero}
          >
            <p>Scroll</p>

            {/* `size-6` requiere Tailwind 3.4; aquí hay 3.3.3. */}
            <ArrowDownRight strokeWidth={3} className="h-6 w-6" />
          </div>
        </Magnetic>
      )}
      <div id="hero" ref={heroRef}>
        <Hero />
      </div>
      <Description />
      <SlidingImages slider1={slider1} slider2={slider2} />
      <ContrastCursor isActive={false} text={'Go to project'} />
    </div>
  );
}
