import { Inter } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import Animations from './animations';
import Header from '@/components/layout/header';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Mike's portfolio",
  description: 'Mike is a software engineer and designer.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="overflow-x-hidden">
        <Animations>
          <Header />
          <div className="flex flex-col bg-background text-foreground">
            <main className={`flex-grow ${inter.className}`}>{children}</main>
          </div>
          <Toaster />
        </Animations>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
