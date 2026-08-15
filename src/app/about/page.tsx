'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useSpotify } from '@/hooks/useSpotify';
import Layout from '@/components/layout';
import SpotifyPlaylists from '@/app/about/spotifyPlaylists';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Posiciones deterministas: con Math.random() el HTML del servidor y el del
// cliente difieren y React tira un error de hidratación en cada carga.
const STAR_POSITIONS = (() => {
  let seed = 0x2f6e2b1;
  const next = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 50 }, () => ({
    top: `${(next() * 100).toFixed(3)}%`,
    left: `${(next() * 100).toFixed(3)}%`
  }));
})();

export default function About() {
  const starsRef = useRef<HTMLDivElement>(null);
  const { playlists, isLoading: spotifyLoading } = useSpotify();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (!starsRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(starsRef.current.children, {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      rotation: 'random(-360, 360)',
      duration: 3,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      stagger: 0.1
    });

    // 50 tweens infinitos seguían corriendo tras salir de la página.
    return () => {
      tween.kill();
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      const words = gsap.utils.toArray('.interactive-word');
      const tweens: gsap.core.Tween[] = [];

      const animateWord = (word: any) => {
        const animProps = getAnimationProperties(word);
        if (!animProps) return;

        const tween = gsap.to(word, {
          ...animProps.to,
          duration: 0.4,
          ease: 'power2.inOut',
          repeat: 1,
          yoyo: true,
          repeatDelay: 1,
          delay: gsap.utils.random(2, 8),
          onComplete: () => {
            animateWord(word);
          }
        });
        tweens.push(tween);
      };

      words.forEach(animateWord);

      return () => {
        tweens.forEach((tween) => tween.kill());
        words.forEach((word: any) => {
          const animProps = getAnimationProperties(word);
          if (animProps) {
            gsap.set(word, animProps.from);
          }
        });
      };
    }
  }, [isMobile]);

  const getAnimationProperties = (element: HTMLElement) => {
    if (element.textContent?.includes('Mike Espinosa')) {
      return { to: { scale: 1.05, color: '#FF6B6B', skewY: -2 }, from: { scale: 1, color: 'inherit', skewY: 0 } };
    }
    if (element.textContent?.includes('verde')) {
      return { to: { color: '#1DB954' }, from: { color: 'inherit' } }; // Pulse is handled by CSS
    }
    if (element.textContent?.includes('Java, Python')) {
      return { to: { scale: 1.05, color: '#4ECDC4', letterSpacing: '0.05em' }, from: { scale: 1, color: 'inherit', letterSpacing: 'normal' } };
    }
    if (element.textContent?.includes('React, Node.js')) {
      return { to: { scale: 1.05, filter: 'blur(0.5px) brightness(1.1)', color: '#FFD93D' }, from: { scale: 1, filter: 'none', color: 'inherit' } };
    }
    if (element.textContent?.includes('resiliencia')) {
        return { to: { scale: 1.05 }, from: { scale: 1 } }; 
    }
    if (element.textContent?.includes('diabetes tipo 1')) {
      return { to: { color: '#0077FF' }, from: { color: 'inherit' } };
    }
     if (element.textContent?.includes('Universidad Francisco de Vitoria')) {
      return { to: { color: '#6C5CE7' }, from: { color: 'inherit' } };
    }
    if (element.textContent?.includes('soft skills')) {
      return { to: { textShadow: '2px 2px 2px rgba(0,0,0,0.2)', color: '#00B894' }, from: { textShadow: 'none', color: 'inherit' } };
    }
    if (element.textContent?.includes('trayectoria')) {
      return { to: { scale: 1.05, color: '#E84393', rotation: 2 }, from: { scale: 1, color: 'inherit', rotation: 0 } };
    }
    if (element.textContent?.includes('Binary')) {
      return { to: { scale: 1.05, color: '#F79F1F' }, from: { scale: 1, color: 'inherit' } };
    }
    if (element.textContent?.includes('aprendizaje continuo')) {
      return { to: { scale: 1.05, filter: 'blur(0.5px)', color: '#6C5CE7' }, from: { scale: 1, filter: 'none', color: 'inherit' } };
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#a8e6cf] via-[#dcedc1] to-[#e8f3dc]">
      <Layout title="I'm Mike" center>
        <div className="relative min-h-screen">
          <div ref={starsRef}>
            {STAR_POSITIONS.map((position, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white opacity-70"
                style={position}
              />
            ))}
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-16 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-24 lg:gap-y-10">
              {/* Image */}
              <div className="w-full max-w-lg lg:col-start-1 lg:row-start-1 lg:max-w-none">
                <div className="relative flex-grow">
                  <div className="rounded-full blur-3xl" />
                  <Image
                    className="relative z-10 mx-auto h-auto w-full max-w-md rounded-t-full shadow-lg"
                    width={1440}
                    height={1800}
                    src="/images/profile2.jpg"
                    alt="Foto de perfil de Mike Espinosa"
                    priority
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex w-full max-w-3xl flex-col items-center text-center lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:max-w-none lg:items-start lg:text-left">
                <div className="text-foreground/70 space-y-8">
                  <p className="gradient-heading text-2xl font-semibold">
                    Ingeniero en Tecnologías de la Información y Negocios Digitales con pasión por la innovación y la tecnología de vanguardia.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    Soy <strong className="interactive-word inline-block hover:scale-105 hover:text-[#FF6B6B] hover:skew-y-2 transition-all duration-300 ease-in-out cursor-pointer">Mike Espinosa</strong>, estudiante de Ingeniería en Tecnologías de la Información y Negocios Digitales en la Universidad Anáhuac Mayab, especializado en integrar soluciones técnicas con estrategias de negocio digital. Mi trayectoria combina emprendimiento temprano colaborando con marcas internacionales desde los 16 años con una visión global adquirida en proyectos transfronterizos. Como podrás notar por el diseño de mi portafolio, tengo cierta afinidad por el color <strong className="interactive-word inline-block hover:animate-pulse hover:text-[#1DB954] transition-all duration-300 ease-in-out cursor-pointer relative group">verde<span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DB954] rounded-full opacity-0 group-hover:opacity-100 animate-ping"></span></strong> y la tecnología que impacta positivamente.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    Mi expertise técnica incluye dominio avanzado de <strong className="interactive-word inline-block hover:scale-105 hover:text-[#4ECDC4] hover:tracking-wider transition-all duration-300 ease-in-out cursor-pointer">Java, Python, TypeScript, C++ y SQL</strong>, complementado con frameworks como <strong className="interactive-word inline-block hover:scale-105 hover:text-[#FFD93D] hover:blur-[0.5px] hover:brightness-110 transition-all duration-300 ease-in-out cursor-pointer">React, Node.js, Next.js y Docker</strong>. Actualmente trabajo como freelancer desarrollando aplicaciones web full-stack para clientes internacionales, priorizando arquitecturas escalables y experiencias de usuario intuitivas. Mi metodología integra prácticas ágiles con documentación precisa para garantizar calidad y mantenibilidad.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    La <strong className="interactive-word inline-block relative hover:scale-105 group transition-all duration-500 ease-in-out cursor-pointer">
                      <span className="relative z-10 text-black transition-colors duration-300 group-hover:text-[#ff4757] group-hover:animate-pulse">resiliencia</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#ff4757]/20 to-transparent rounded-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      <span className="absolute -inset-1 bg-[#ff4757]/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                      <span className="absolute inset-0 border-2 border-[#ff4757] rounded-lg transform scale-105 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
                    </strong> define mi camino: viviendo con<a href="https://www.jdrf.org/t1d-resources/" target="_blank" rel="noopener noreferrer" className="interactive-word group/diabetes inline-block relative cursor-pointer">
                      <span className="diabetes-text relative inline-block text-black transition-colors duration-300 group-hover/diabetes:text-[#0077FF]">diabetes tipo 1</span>
                      <span className="syringe absolute -left-8 -top-1 transform opacity-0 group-hover/diabetes:opacity-100 transition-all duration-300 z-10 rotate-[30deg]">
                        <span className="syringe-body absolute left-0 w-8 h-2.5 bg-gradient-to-r from-[#E0E0E0] to-[#F5F5F5] rounded-lg transform group-hover/diabetes:translate-x-[6px] group-hover/diabetes:translate-y-[3px] transition-transform duration-500 border border-[#B0B0B0] shadow-sm">
                          <span className="absolute right-0 w-1.5 h-2.5 bg-[#B0B0B0] rounded-r-lg"></span>
                        </span>
                        <span className="syringe-needle-base absolute left-[31px] top-[3px] w-2 h-1.5 bg-gradient-to-r from-[#909090] to-[#A0A0A0] rounded-sm transform origin-left scale-x-0 group-hover/diabetes:scale-x-100 transition-transform duration-300"></span>
                        <span className="syringe-needle absolute left-[33px] top-[4px] w-4 bg-gradient-to-r from-[#909090] to-[#A0A0A0] transform origin-left scale-x-0 group-hover/diabetes:scale-x-100 transition-transform duration-300" style={{ 
                          height: '0.5px',
                          boxShadow: '0 0.25px 0 rgba(0,0,0,0.3)',
                          background: 'linear-gradient(90deg, #909090 0%, #B0B0B0 100%)'
                        }}></span>
                        <span className="syringe-needle-tip absolute left-[49px] top-[3.75px] w-0.5 h-0.5 transform rotate-45 origin-left scale-0 group-hover/diabetes:scale-100 transition-transform duration-300 delay-200" style={{
                          background: 'linear-gradient(135deg, #909090 0%, #707070 100%)',
                          clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
                        }}></span>
                        <span className="syringe-plunger absolute left-1 w-2 h-4 bg-[#0077FF] rounded-sm transform -translate-y-0.75 group-hover/diabetes:translate-x-[6px] group-hover/diabetes:translate-y-[3px] transition-transform duration-500"></span>
                        <span className="syringe-grip absolute left-0.5 w-3 h-5 border-2 border-[#B0B0B0] rounded-sm transform -translate-y-1.25 group-hover/diabetes:translate-x-[6px] group-hover/diabetes:translate-y-[3px] transition-transform duration-500 bg-white/50"></span>
                        <span className="syringe-measurement absolute left-4 top-0 w-3 h-2.5 flex flex-col justify-end opacity-80">
                          <span className="h-[1px] w-full bg-[#B0B0B0]"></span>
                        </span>
                      </span>
                      <span className="injection absolute inset-0 bg-gradient-to-r from-[#0077FF]/20 via-[#0077FF]/10 to-transparent transform scale-x-0 group-hover/diabetes:scale-x-100 transition-transform duration-1000 origin-left" style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      }}></span>
                    </a> y después de una <span className="heart-beat inline-block text-black animate-heartbeat">cirugía cardíaca</span>, he transformado los desafíos en un motor de crecimiento. Esta fortaleza se materializa en mi voluntariado enseñando programación a niños vulnerables y en mi disciplina para equilibrar salud, estudios y desarrollo profesional. Cada reto reforzó mi filosofía, recordándome que <span className="group inline-block align-baseline whitespace-nowrap">
                      &ldquo;los límites existen para ser reprogramados&rdquo;
                    </span>.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    Entre septiembre de 2025 y mayo de 2026 cursé un intercambio académico en la <a href="https://www.ufv.es/" target="_blank" rel="noopener noreferrer"><strong className="interactive-word group inline-block relative hover:text-[#6C5CE7] transition-all duration-300 ease-in-out cursor-pointer after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#6C5CE7] after:transition-transform after:duration-300 hover:after:scale-x-100">Universidad Francisco de Vitoria (UFV)</strong></a> en Madrid, donde profundicé en inteligencia artificial y ciberseguridad. Vivir y estudiar un año fuera afianzó mi autonomía y me dio una perspectiva internacional del sector que hoy aplico en cada proyecto. Actualmente busco retos freelance que amplíen mi experiencia en sistemas distribuidos, y a largo plazo aspiro a liderar iniciativas tecnológicas con impacto social significativo, especialmente en economías emergentes.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    Mis <strong className="interactive-word inline-block relative hover:text-[#00B894] transition-all duration-300 ease-in-out cursor-pointer hover:[text-shadow:_2px_2px_2px_rgb(0_0_0_/_20%)]">soft skills</strong> incluyen liderazgo adaptativo, resolución creativa de problemas, comunicación efectiva, inteligencia emocional, trabajo colaborativo, gestión del tiempo y resiliencia. Estas habilidades se nutren de hobbies como edición profesional de video (Adobe Premiere, DaVinci Resolve), diseño de experiencias interactivas y análisis de narrativas digitales. Estas competencias me permiten crear soluciones técnicas con perspectiva humana.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl">
                    Mi <strong className="interactive-word inline-block hover:scale-105 hover:text-[#E84393] hover:rotate-2 transition-all duration-300 ease-in-out cursor-pointer">trayectoria</strong> refleja una combinación única de habilidades técnicas y perspectiva humana. Como estudiante y desarrollador freelance, me impulsa la pasión por crear tecnología que no solo sea técnicamente sólida, sino que también genere un impacto positivo. Mi experiencia con desafíos personales ha forjado una mentalidad resiliente y creativa, mientras que mi formación técnica y experiencia práctica me permiten transformar ideas innovadoras en soluciones tangibles. Esa combinación se ha puesto a prueba en competencias como el <strong className="interactive-word inline-block hover:scale-105 hover:text-[#F79F1F] transition-all duration-300 ease-in-out cursor-pointer">Binary &amp; Quantum Challenge</strong>, donde obtuve el 3.<sup>er</sup> lugar en marzo de 2025. Estoy comprometido con el <strong className="interactive-word inline-block hover:scale-105 hover:text-[#6C5CE7] hover:blur-[0.5px] transition-all duration-300 ease-in-out cursor-pointer">aprendizaje continuo</strong> y la aplicación de la tecnología para crear un futuro más inclusivo y sostenible.
                  </p>
                </div>
              </div>

              {/* Spotify */}
              <div className="w-full max-w-lg flex-shrink-0 lg:col-start-1 lg:row-start-2 lg:max-w-none">
                {spotifyLoading ? (
                  <p className="text-center">Cargando playlists…</p>
                ) : playlists.length > 0 ? (
                  <div className="w-full">
                    <SpotifyPlaylists playlists={playlists} />
                  </div>
                ) : (
                  // Si Spotify falla, la sección simplemente no se muestra en
                  // vez de escupir el mensaje de error crudo en la página.
                  null
                )}
              </div>
            </div>
            <div className="flex flex-col gap-8">
              {/* Removed GitHub link */}
            </div>
          </div>
        </div>
      </Layout>
      <style jsx global>{`
        @keyframes typewriterBinary {
          0% {
            opacity: 0;
          }
          1% {
            opacity: 1;
            content: '1';
          }
          33% {
            content: '0';
          }
          66% {
            content: '1';
          }
          100% {
            opacity: 1;
            content: '0';
          }
        }
        .binary-container {
          display: inline-block;
          position: relative;
        }
        .binary-text {
          white-space: pre;
        }
        .binary-text span {
          position: relative;
        }
        .binary-text span::before {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
        }
        @keyframes binaryTypewriter {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
            content: '1';
          }
          40% {
            content: '0';
          }
          60% {
            content: '1';
          }
          80% {
            content: '0';
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes binarySpace {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .binary-container:hover .binary-text {
          opacity: 1;
        }
        .binary-text {
          transition: opacity 0.3s ease;
        }
        .binary-char {
          display: inline-block;
          position: relative;
        }
        .group:hover .binary-text .binary-char {
          animation-play-state: running;
        }
        .diabetes-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #0077FF;
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        
        .group-hover\/diabetes .diabetes-text::after {
          transform: scaleX(1);
        }

        @keyframes inject {
          0% {
            transform: translate(0, 0) rotate(30deg);
          }
          40% {
            transform: translate(6px, 3px) rotate(30deg);
          }
          60% {
            transform: translate(4px, 2px) rotate(30deg);
          }
          100% {
            transform: translate(5px, 2.5px) rotate(30deg);
          }
        }

        .group-hover\/diabetes .syringe {
          animation: inject 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        .syringe-body::before {
          content: '';
          position: absolute;
          left: 2px;
          top: 50%;
          transform: translateY(-50%);
          width: 70%;
          height: 60%;
          background: linear-gradient(90deg, rgba(0,119,255,0.3) 0%, rgba(0,119,255,0.1) 100%);
          border-radius: 4px;
          transition: all 0.5s ease;
        }

        .group-hover\/diabetes .syringe-body::before {
          width: 30%;
          opacity: 0.7;
        }

        .diabetes-text {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }

        @keyframes heartbeat {
          0%, 100% {
            color: black;
            transform: scale(1);
            filter: blur(0);
          }
          88% {
            color: black;
            transform: scale(1);
            filter: blur(0);
          }
          92% {
            color: #ff4757;
            transform: scale(1.15);
            filter: blur(1px);
          }
          96% {
            color: #ff4757;
            transform: scale(1.05);
            filter: blur(0.5px);
          }
        }

        .animate-heartbeat {
          animation: heartbeat 4s infinite;
        }

        @keyframes rainbow-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Renombrado desde .rainbow-text: colisionaba con la regla de
           globals.css, cuya animación de color anulaba el degradado. */
        .gradient-heading {
          background: linear-gradient(
            to right,
            #2C3E50,    /* Azul oscuro */
            #8E44AD,    /* Púrpura */
            #16A085,    /* Verde azulado oscuro */
            #2C3E50     /* Vuelve al azul oscuro */
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: rainbow-animation 12s ease infinite;
          text-shadow: 0 1px 1px rgba(0,0,0,0.1);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
