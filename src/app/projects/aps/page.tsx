'use client';
import ProjectHero from '@/app/projects/project/hero';
import PageScrollParallax from '@/components/pageScrollParallax';
import Image from 'next/image';
import React from 'react';

import Img1 from '../../../../public/images/aps/APS1.jpg';
import Img2 from '../../../../public/images/aps/APS2.png';
import Img3 from '../../../../public/images/aps/APS3.png';
import Img4 from '../../../../public/images/aps/APS4.png';
import Img5 from '../../../../public/images/aps/APS3.webp';

export default function APSProject() {
  const researchAssets = [Img3, Img2];
  const introduction =
    'Una experiencia que transforma vidas y construye puentes entre personas. ' +
    'A través de visitas y momentos compartidos, se forman conexiones genuinas ' +
    'que nos enseñan el verdadero significado de la amistad y el servicio a los demás.';

  const description = 'Construyendo Lazos que Perduran';
  const myRole =
    'Como voluntario, tuve el privilegio de compartir momentos invaluables ' +
    'que me enseñaron lecciones de vida fundamentales. Las visitas se convirtieron en espacios de ' +
    'alegría, aprendizaje mutuo y crecimiento personal. Cada experiencia fortaleció un vínculo especial que perdurará para siempre.';

  const staticImgs = [Img1, Img4, Img5];

  return (
    <div className="bg-foreground">
      {/* El vídeo institucional de Soñar Despierto tiene el embebido
          desactivado (player.vimeo.com devuelve 401), así que se muestra una
          portada propia y se enlaza al vídeo original, que sí es público. */}
      <ProjectHero
        description={myRole}
        media={'https://player.vimeo.com/video/307596948'}
        posterSrc={Img1}
        videoHref={'https://vimeo.com/307596948'}
        isImage={false}
        title={'Amigos Para Siempre'}
      />
      <div className="hidden lg:block">
      <PageScrollParallax
        title={'Un Viaje de Amistad y Aprendizaje'}
        body={introduction}
        word={description}
          staticImgs={staticImgs}
        textColor="text-[#FF5722]"
        textOpacity={0.8}
      />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 p-8">
        {researchAssets.map((asset, index) => (
          <div key={index} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={asset}
            alt="Momentos compartidos"
              fill
              quality={80}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
          />
          </div>
        ))}
      </div>
    </div>
  );
}
