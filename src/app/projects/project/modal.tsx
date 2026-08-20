import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
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
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //Move Container
      let xMoveContainer = gsap.quickTo(modalContainer.current, 'left', {
        duration: 0.8,
        ease: 'power3'
      });

      let yMoveContainer = gsap.quickTo(modalContainer.current, 'top', {
        duration: 0.8,
        ease: 'power3'
      });

      //Move cursor
      let xMoveCursor = gsap.quickTo(cursor.current, 'left', {
        duration: 0.5,
        ease: 'power3'
      });

      let yMoveCursor = gsap.quickTo(cursor.current, 'top', {
        duration: 0.5,
        ease: 'power3'
      });

      //Move cursor label
      let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'left', {
        duration: 0.45,
        ease: 'power3'
      });

      let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'top', {
        duration: 0.45,
        ease: 'power3'
      });

      window.addEventListener('mousemove', (e) => {
        const { pageX, pageY } = e;

        xMoveContainer(pageX);
        yMoveContainer(pageY);
        xMoveCursor(pageX);
        yMoveCursor(pageY);
        xMoveCursorLabel(pageX);
        yMoveCursorLabel(pageY);
      });
    }
  }, []);

  const href = projects[index]?.href;

  const contenido = (
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

  // Sin href el modal no se envuelve en <Link>: GlucoMind ya no enlaza a nada.
  return href ? <Link href={href}>{contenido}</Link> : contenido;
}
