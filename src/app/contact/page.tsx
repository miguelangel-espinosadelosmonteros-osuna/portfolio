'use client';

import TextDisperse from '@/app/contact/textDisperse/textDisperse';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ContactForm } from '@/app/contact/contactForm';
import { useToast } from '@/components/ui/use-toast';

export default function Contact() {
  const background = useRef(null);
  const emailRef = useRef(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const { toast } = useToast();

  const setBackground = (isActive: any) => {
    gsap.to(background.current, { opacity: isActive ? 0.7 : 0 });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('mike.espinosa1203@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const scrollToEmail = () => {
    if (typeof window === 'undefined') return;
    
    const emailSection = document.getElementById('email');
    copyEmail();
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="-mt-20 bg-foreground text-white ">
      <div className="flex min-h-screen w-full items-center justify-center pt-44 align-middle text-[8.6vw] xs:text-[5.6vw]">
        <div className="p-12 xs:w-1/2 xs:p-0">
          <div className="flex justify-between uppercase">
            <p className="m-0">Miguel</p>
            <p className="m-0">Ángel</p>
          </div>
          <div className="flex justify-between uppercase">
            <p className="m-0">ING. en T.I.</p>
            <p className="m-0">y</p>
          </div>
          <div className="flex justify-center uppercase">
            <p className="m-0">Negocios Digitales</p>
          </div>
          <Link href={'https://www.linkedin.com/in/miguel-angel-espinosa-de-los-monteros-283bb930b'}>
            <TextDisperse setBackground={setBackground}>
              <p>→LinkedIn</p>
            </TextDisperse>
          </Link>
          <a href="mailto:mike.espinosa1203@gmail.com">
            <TextDisperse
              setBackground={setBackground}
              onClick={() => {
                toast({
                  description:
                    'Correo copiado al portapapeles. ¡También puedes usar el formulario!'
                });
                scrollToEmail();
              }}
            >
              <p className="m-0">→Email</p>
            </TextDisperse>
          </a>

          <Link href={'https://github.com/miguelangel-espinosadelosmonteros-osuna'}>
            <TextDisperse setBackground={setBackground}>
              <p>→Github</p>
            </TextDisperse>
          </Link>
          <div
            ref={background}
            className={clsx(
              'pointer-events-none absolute inset-0 h-full w-full bg-foreground text-[5.6vw] opacity-0'
            )}
          ></div>
        </div>
      </div>
      <div className="px-12 sm:px-56" id="email" ref={emailRef}>
        <ContactForm />
      </div>
    </div>
  );
}
