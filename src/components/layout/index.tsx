'use client';

import ContrastCursor from '@/components/animations/cursor/contrastCursor';
import { clsx } from 'clsx';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  title?: string;
  center?: boolean;
};

export default function Layout({ children, title, center }: Props) {
  const parts = title ? title.split('Mike') : [''];

  return (
    <div className="mt-24 px-4 py-8 sm:px-6 lg:mt-36 lg:px-8 lg:py-16">
      <main
        className={cn(
          'min-h-screen',
          center && 'flex flex-col items-center justify-center'
        )}
      >
        <h1
          className={clsx(
            // Sin whitespace-nowrap: a 10rem el título desbordaba el viewport
            // en móvil y provocaba scroll horizontal en toda la página.
            'pb-8 text-5xl font-medium sm:text-6xl md:text-8xl lg:pb-14 lg:text-[10rem]',
            center ? 'text-center' : ''
          )}
        >
          {parts[0]}
          {parts.length > 1 && (
            <span className="inline-block cursor-pointer transition-all duration-300 ease-in-out hover:rotate-6 hover:scale-110 hover:text-[#1DB954]">
              Mike
            </span>
          )}
          {parts[1]}
        </h1>
        {children}
      </main>
      <ContrastCursor isActive={false} text={''} />
    </div>
  );
}
