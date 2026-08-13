'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Menu from '../nav';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from '@/components/animations/magnetic';
import Image from 'next/image';

export default function Header() {
  const header = useRef(null);
  const pathname = usePathname();
  const button = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: 'power1.out'
          });
        },
        onEnterBack: () => {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: 'power1.out'
          });
        }
      }
    });
  }, []);

  return (
    <>
      <div
        ref={header}
        className="absolute top-0 z-20 box-border flex w-full items-center justify-between gap-2 p-4 font-light text-white mix-blend-difference lg:p-8"
      >
        <div className="flex">
          {/* Mobile and Tablet Logo */}
          <Link href={'/'} className="group z-10 flex items-center space-x-2 lg:hidden">
            <Magnetic>
              <Image
                height={32}
                width={32}
                src="/images/logo.jpg"
                alt="Mikes logo"
                priority
                style={{ objectFit: 'cover' }}
              />
            </Magnetic>
            {/* En pantallas muy estrechas el logo basta: el wordmark
                empujaba el menú fuera del viewport. */}
            <div className="hidden items-center space-x-2 xs:flex">
                <div className="hover:rotate-[360deg]">©</div>
                <div className="text-base sm:text-lg">
                    Mike
                </div>
            </div>
          </Link>
          {/* Desktop Logo */}
          <Link href={'/'} className="group z-10 hidden items-center space-x-2 lg:flex">
            <Magnetic>
              <Image
                height={32}
                width={32}
                src="/images/logo.jpg"
                alt="Mikes logo"
                priority
                style={{ objectFit: 'cover' }}
              />
            </Magnetic>
            <div className="relative flex items-center overflow-hidden whitespace-nowrap">
              {/* Texto inicial completo */}
              <p className="transition-transform duration-500 ease-in-out group-hover:-translate-x-full inline-block">
                © diseñado por&nbsp;Mike
              </p>

              {/* Texto final centrado */}
              <p className="absolute inset-0 flex justify-center transition-transform duration-500 ease-in-out translate-x-full group-hover:translate-x-0">
                Mike&nbsp;Espinosa
              </p>
            </div>
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-end font-semibold">
            <div className="group relative z-10 flex flex-1 cursor-pointer items-center justify-around p-3">
                <Magnetic>
                <Link href={'/about'} className="hover:text-[#16db65] transition-colors duration-300">Sobre mí</Link>
                </Magnetic>
                <Magnetic>
                <Link href={'/projects'} className="hover:text-[#16db65] transition-colors duration-300">Proyectos</Link>
                </Magnetic>
            </div>
            <div className="group relative z-10 flex cursor-pointer items-center p-3">
              <Magnetic>
                <div className="flex items-center space-x-1 hover:text-[#16db65] transition-colors duration-300">
                  <Link href={'/contact'}>Contacto</Link>
                  <ArrowUpRight size={18} />
                </div>
              </Magnetic>
            </div>
        </div>
        <div className="lg:hidden">
          <Menu />
        </div>
      </div>
    </>
  );
}
