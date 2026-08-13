'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '@/components/animations/magnetic';
import RoundedButton from '@/components/animations/roundedButton';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTiktok, FaEnvelope } from 'react-icons/fa6';
import { FaFileLines } from 'react-icons/fa6';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';

const contact = [
    {
        icon: <FaGithub />,
        link: 'https://github.com/miguelangel-espinosadelosmonteros-osuna',
        ariaLabel: 'GitHub de Mike Espinosa'
    },
    {
        icon: <FaLinkedin />,
        link: 'https://www.linkedin.com/in/mikespinosa/',
        ariaLabel: 'LinkedIn de Mike Espinosa'
    },
    {
        icon: <FaTiktok />,
        link: 'https://www.tiktok.com/@dev.mikespinosa',
        ariaLabel: 'TikTok de Mike Espinosa'
    },
    {
        icon: <FaEnvelope />,
        link: 'mailto:mikespinosa92@gmail.com',
        ariaLabel: 'Enviar correo a Mike Espinosa'
    },
    {
        icon: <FaFileLines />,
        link: '/mikespinosa-cv.pdf',
        ariaLabel: 'Descargar CV de Mike Espinosa'
    }
];

export default function ContactInfo() {
  const container = useRef(null);
  const [currentTime, setCurrentTime] = useState('');
  const email = 'mike.espinosa1203@gmail.com';
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end']
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const y = useTransform(scrollYProgress, [0, 1], [isMobile ? -150 : -500, 0]);
  const animatedUnderlineStyle =
    'relative after:absolute after:left-1/2 after:mt-0.5 after:block after:h-px after:w-0' +
    ' after:-translate-x-1/2 after:transform after:bg-white after:duration-200 ' +
    "after:ease-linear after:content-[''] hover:after:w-full";
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Merida'
      };
      setCurrentTime(now.toLocaleTimeString('es-MX', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(email);
    toast.success('Abriendo cliente de correo...');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const sparkleKeyframes = `
    @keyframes sparkle {
      0%, 100% {
        background: radial-gradient(circle at center, rgba(255,255,255,0) 0%, transparent 50%);
        transform: scale(1);
      }
      50% {
        background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 50%);
        transform: scale(1.2);
      }
    }
    `;

    const style = document.createElement('style');
    style.textContent = sparkleKeyframes;
    document.head.appendChild(style);
    
    return () => {
      // Cleanup - remove the style element when component unmounts
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <motion.div
      style={{ y }}
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-between bg-foreground p-4 sm:p-6 pt-20 sm:pt-32 text-white sm:justify-center"
    >
      <div className="w-full bg-foreground pt-[100px] sm:pt-[150px] sm:max-w-[1800px]">
        <div className="relative border-b border-gray-600 pb-8 sm:pb-12 px-4 sm:px-0 sm:mx-[100px]">
          <span className="flex flex-col space-y-6 sm:space-y-8">
            <div className="flex items-start">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-[100px] md:w-[100px] overflow-hidden rounded-full flex-shrink-0">
                <Image
                  fill
                  alt={'profile'}
                  src={`/images/profile.jpg`}
                  priority
                  sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 100px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div className="ml-4 sm:ml-6 flex flex-col space-y-2 sm:space-y-4 flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-[5vh] font-medium">
                  ¡Trabajemos juntos!
                </h2>
                <h3 className="text-base sm:text-lg md:text-2xl font-medium text-[#058c42]">
                  Miguel Angel Espinosa de los Monteros
                </h3>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">
                  <span>Ingeniero en Tecnologías de la Información y Negocios Digitales & Creador de Contenido</span>
                </div>
              </div>
            </div>
          </span>
          <motion.div
            style={{ x }}
            className="absolute left-[calc(100%-120px)] top-[calc(100%+60px)] sm:left-[calc(100%-150px)] sm:top-[calc(100%+100px)] md:left-[calc(100%-400px)] md:top-[calc(100%-75px)] hidden lg:block"
          >
            <Link href={'/contact'}>
              <RoundedButton className="absolute h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] md:h-[200px] md:w-[200px] cursor-pointer items-center justify-center rounded-full bg-destructive text-white text-sm sm:text-base md:text-3xl border-0">
                Contáctame
              </RoundedButton>
            </Link>
          </motion.div>
        </div>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-5 px-4 sm:px-0 sm:mx-[100px]">
          <a 
            href={`mailto:${email}`}
            onClick={() => toast.success('Abriendo cliente de correo...')}
            className="w-full sm:w-auto"
          >
            <RoundedButton>
              <div className="cursor-pointer flex items-center justify-center sm:justify-start gap-2 group text-sm sm:text-base">
                <FaEnvelope className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="truncate">{email}</span>
              </div>
            </RoundedButton>
          </a>
          <a 
            href="/documents/CVEspanol.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success('Abriendo CV...')}
            className="w-full sm:w-auto"
          >
            <RoundedButton>
              <div className="cursor-pointer flex items-center justify-center sm:justify-start gap-2 group text-sm sm:text-base">
                <FaFileLines className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                <span>CV Español</span>
              </div>
            </RoundedButton>
          </a>
          <a 
            href="/documents/CVEnglish.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.success('Abriendo CV...')}
            className="w-full sm:w-auto"
          >
            <RoundedButton>
              <div className="cursor-pointer flex items-center justify-center sm:justify-start gap-2 group text-sm sm:text-base">
                <FaFileLines className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                <span>CV Inglés</span>
              </div>
            </RoundedButton>
          </a>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-20 flex flex-col justify-between p-4 sm:p-5 space-y-8 md:space-y-12 sm:flex-row sm:items-end sm:space-y-0 sm:mx-[100px]">
          <div className="flex flex-col gap-8">
            <p className="text-sm sm:text-base max-w-full sm:max-w-md leading-relaxed">
              Ingeniero en Tecnologías de la Información y Negocios Digitales | 
              <Link href="https://www.tiktok.com/@mikespinosa" className="group/creator inline-flex items-center mx-1 sm:mx-2">
                <span className="relative cursor-pointer transition-all duration-300 group-hover/creator:text-[#ff0050] group-hover/creator:scale-110">
                  Creador de contenido
                  <span className="absolute inset-0 group-hover/creator:animate-sparkle opacity-0 group-hover/creator:opacity-100" />
                </span>
              </Link>
              | AI | Tecnología con impacto positivo, esa es mi misión.
            </p>
            <div className="flex flex-row items-start gap-4 sm:gap-2">
              <span className="flex flex-col gap-2 sm:gap-3">
                <h3 className="m-0 cursor-default text-sm sm:text-base font-light text-gray-500">
                Versión
              </h3>
                <p className="relative m-0 cursor-pointer text-sm sm:text-base">2025.6.4</p>
            </span>
              <span className="flex flex-col gap-2 sm:gap-3">
                <h3 className="m-0 cursor-default text-sm sm:text-base font-light text-gray-500">
                Timezone
              </h3>
                <p className="relative m-0 cursor-pointer text-sm sm:text-base">
                {currentTime} (GMT-6) Mérida
              </p>
            </span>
          </div>
          </div>
          <div className="flex flex-col sm:items-start gap-4 sm:gap-2">
            <h3 className="m-0 cursor-default text-sm sm:text-base font-light text-gray-500">
                Redes Sociales
              </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="https://github.com/miguelangel-espinosadelosmonteros-osuna"
                      className="flex items-center gap-1 group transition-all duration-300"
                    >
                      <FaGithub size={20} className="sm:w-6 sm:h-6 text-white group-hover:text-[#6e7681] transition-colors duration-300" />
                      <div className="flex items-center">
                        <span className="mr-1 sm:mr-2 text-sm sm:text-base transition-colors duration-300 group-hover:text-[#6e7681]">GitHub</span>
                        {/* El handle real son 40 caracteres y desplazaba la
                            fila al revelarse; aquí va el nombre y el handle
                            completo queda en el tooltip. */}
                        <span className="whitespace-nowrap text-[#6e7681] opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-sm sm:text-base">
                          Miguel Ángel Espinosa
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>github.com/miguelangel-espinosadelosmonteros-osuna</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="https://www.linkedin.com/in/miguel-angel-espinosa-de-los-monteros-283bb930b"
                      className="flex items-center gap-1 group transition-all duration-300"
                    >
                      <FaLinkedin size={20} className="sm:w-6 sm:h-6 text-white group-hover:text-[#0077b5] transition-colors duration-300" />
                      <div className="flex items-center">
                        <span className="mr-1 sm:mr-2 text-sm sm:text-base transition-colors duration-300 group-hover:text-[#0077b5]">LinkedIn</span>
                        <span className="text-[#0077b5] opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-sm sm:text-base">
                          Miguel Angel Espinosa
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>LinkedIn: Miguel Angel Espinosa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="https://www.tiktok.com/@mikespinosa"
                      className="flex items-center gap-1 group transition-all duration-300"
                    >
                      <FaTiktok size={20} className="sm:w-6 sm:h-6 text-white group-hover:text-[#ff0050] transition-colors duration-300" />
                      <div className="flex items-center">
                        <span className="mr-1 sm:mr-2 text-sm sm:text-base transition-colors duration-300 group-hover:text-[#ff0050]">TikTok</span>
                        <span className="text-[#ff0050] opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-sm sm:text-base">
                          @mikespinosa
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>TikTok: @mikespinosa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
