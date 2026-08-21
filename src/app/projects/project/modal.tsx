import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ModalContext } from '@/app/projects/modalContext';
import { Plus } from 'lucide-react';

const scaleAnimation = {
  initial: { scale: 0, x: '-50%', y: '-50%' },
  enter: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
  },
  closed: {
    scale: 0,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] }
  }
};

interface ModalProps {
  projects: {
    src: string;
    color: string;
    href?: string;
    special?: string;
  }[];
}

export default function Modal({ projects }: ModalProps) {
  const { modal } = useContext(ModalContext);
  const { active, index } = modal;
  const modalContainer = useRef(null);

  useEffect(() => {
    const el = modalContainer.current as HTMLElement | null;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'left', { duration: 0.8, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'top', { duration: 0.8, ease: 'power3' });

    const MARGEN = 12;

    const acotar = (v: number, min: number, max: number) =>
      min > max ? (min + max) / 2 : Math.min(Math.max(v, min), max);

    const onMouseMove = (e: MouseEvent) => {
      // `left`/`top` son relativos al offsetParent, pero se les pasaba pageX/
      // pageY (coordenadas de documento). Como el contenedor arranca 144px más
      // abajo por el mt-36 del layout, la preview iba siempre 144px por debajo
      // del cursor y se salía de la pantalla en los proyectos de abajo.
      const padre = el.offsetParent as HTMLElement | null;
      const r = padre?.getBoundingClientRect();
      const padreX = (r?.left ?? 0) + window.scrollX;
      const padreY = (r?.top ?? 0) + window.scrollY;

      const mitadAncho = el.offsetWidth / 2;
      const mitadAlto = el.offsetHeight / 2;

      // Se centra en el cursor con translate(-50%,-50%): su centro debe
      // mantenerse a media caja de cada borde visible.
      const x = acotar(
        e.pageX,
        window.scrollX + mitadAncho + MARGEN,
        window.scrollX + window.innerWidth - mitadAncho - MARGEN
      );
      const y = acotar(
        e.pageY,
        window.scrollY + mitadAlto + MARGEN,
        window.scrollY + window.innerHeight - mitadAlto - MARGEN
      );

      xTo(x - padreX);
      yTo(y - padreY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // El listener sobrevivía a la navegación: nunca se eliminaba.
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Sin envoltorio condicional: alternar entre <Link> y <div> según el
  // proyecto hovereado remontaba este nodo, así perdía el left/top que le fija
  // GSAP y los quickTo se quedaban animando el nodo antiguo ya desechado.
  // El <Link> además era inocuo: pointer-events-none deja pasar los clics a la
  // fila del proyecto, que ya es un enlace.
  return (
      <motion.div
        variants={scaleAnimation}
        ref={modalContainer}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
        className="pointer-events-none absolute z-50 flex h-[350px] w-[400px] items-center justify-center overflow-hidden bg-background"
      >
        <div
          style={{ top: index * -100 + '%' }}
          className="transition-top ease-custom-cubic absolute h-full w-full duration-500"
        >
          {projects.map((project, index) => {
            const { src, color, special } = project;
            const isSpecial = special === 'rainbow';

            if (isSpecial) {
              return (
                <div
                  className="flex h-full w-full items-center justify-center rainbow-bg"
                  key={`modal_${index}`}
                >
                  <Plus className="h-24 w-24 text-white" />
                </div>
              );
            }

            return (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundColor: color }}
                key={`modal_${index}`}
              >
                <Image
                  src={`/images/${src}`}
                  width={350}
                  height={350}
                  alt="image"
                  className="h-auto"
                />
              </div>
            );
          })}
        </div>
      </motion.div>
  );
}
