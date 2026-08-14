import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // `domains` está deprecado en Next 15; remotePatterns lo cubre.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'mosaic.scdn.co' },
      { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com' },
      { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // `unoptimized: true` servía los PNG originales tal cual: hay archivos de
    // más de 4 MB en /public. Con la optimización activa, Vercel los
    // reescala y los sirve en AVIF/WebP según el viewport.
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

export default analyzer(nextConfig); 