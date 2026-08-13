import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Menu() {
  return (
    <nav
      aria-label="Navegación principal"
      className="flex items-center gap-x-3 whitespace-nowrap text-xs text-white xs:gap-x-4 xs:text-sm sm:text-base lg:hidden"
    >
      <Link href="/about" className="transition-colors duration-300 hover:text-[#16db65]">Sobre mí</Link>
      <Link href="/projects" className="transition-colors duration-300 hover:text-[#16db65]">Proyectos</Link>
      <Link href="/contact" className="flex items-center space-x-1 transition-colors duration-300 hover:text-[#16db65]">
        <span>Contacto</span>
        <ArrowUpRight size={14} />
      </Link>
    </nav>
  );
}
