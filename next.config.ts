// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (best compression), WebP as fallback
    formats: ['image/avif', 'image/webp'],
    // Trim to breakpoints actually used in the UI
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    // Cache optimized images on Vercel CDN for 1 hour
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: 'https', hostname: 'jjmfcxwirsyskokemrbk.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
  },
}

export default nextConfig
