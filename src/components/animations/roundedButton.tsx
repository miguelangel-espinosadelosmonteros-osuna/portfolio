import React, { PropsWithChildren } from 'react';
import Magnetic from '@/components/animations/magnetic';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string;
}

export default function RoundedButton({
  children,
  backgroundColor = 'secondary',
  className,
  ...attributes
}: PropsWithChildren<Props>) {
  return (
    <Magnetic>
      <Button
        variant="rounded"
        className={clsx(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-secondary px-6 py-8 text-lg sm:text-xl group",
          className
        )}
        {...attributes}
      >
        <div className="relative z-10 transition-colors duration-300 ease-linear group-hover:text-white">
          {children}
        </div>
        <div
          className={clsx(
            'absolute top-[100%] h-[150%] w-full rounded-full transition-all duration-500 ease-in-out group-hover:top-[-25%]',
            backgroundColor === 'secondary' ? 'bg-[#058c42]' : 'bg-[#16db65]'
          )}
        ></div>
      </Button>
    </Magnetic>
  );
}
