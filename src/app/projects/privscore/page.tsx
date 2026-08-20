'use client';

import ProjectHero from '@/app/projects/project/hero';
import Image from 'next/image';
import React from 'react';

import Cover from '../../../../public/images/PrivScore/PrivScore1.png';

const stack = [
  'JavaScript',
  'Chrome Extensions API (Manifest V3)',
  'API de Gemini',
  'Service Workers'
];

const secciones = [
  {
    titulo: 'Qué hace',
    texto:
      'Extensión para Chrome y Edge que analiza el sitio abierto y devuelve una calificación de la A a la E. ' +
      'Clasifica las cookies —persistentes, de terceros y por categoría—, detecta scripts e iframes externos, ' +
      'y descarga la política de privacidad del sitio para analizarla.'
  },
  {
    titulo: 'Por qué la nota no la decide la IA',
    texto:
      'La API de Gemini se usa acotada a una sola tarea: extraer señales del texto legal. La calificación final la ' +
      'calcula un algoritmo determinista de cuatro secciones ponderadas. Así el mismo sitio siempre obtiene la misma ' +
      'nota y el resultado se puede auditar, en vez de depender de lo que el modelo responda en cada ejecución.'
  },
  {
    titulo: 'Mi aporte',
    texto:
      'El service worker de la extensión, la clasificación de cookies, el motor de scoring y toda la capa de IA. ' +
      'Fue un proyecto académico en equipo en la Universidad Francisco de Vitoria, en Madrid; la aplicación web ' +
      'complementaria la desarrollaron otros integrantes.'
  }
];

export default function PrivScoreProject() {
  return (
    <div className="bg-foreground">
      <ProjectHero
        title={'PrivScore'}
        description={
          'Extensión de navegador que audita la privacidad de cualquier sitio web y la resume en una nota de la A a la E.'
        }
        media={Cover}
        isImage={false}
        posterSrc={Cover}
        bgColour="bg-[#e8ebed]"
      />

      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 flex flex-wrap gap-2">
          {stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 sm:text-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          {secciones.map((s) => (
            <div key={s.titulo} className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-background sm:text-2xl">
                {s.titulo}
              </h2>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                {s.texto}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-16 aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={Cover}
            alt="PrivScore: calificación de privacidad de la A a la E"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
