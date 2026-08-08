// app/layout.tsx
// No cookies() — no server auth — layout is now fully static.
// UserProvider hydrates auth entirely client-side via onAuthStateChange.
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { CartProvider } from './context/cart-context'
import { ConditionalNavbar } from '@/components/conditional-navbar'
import { UserProvider } from './context/user-context'
import { ClientErrorBoundary } from '@/components/error-boundaries'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: '%s | ActiveWell Pharma',
    default: 'ActiveWell Pharma | Premium Plant-Based Wellness',
  },
  description: 'ActiveWell Pharma delivers clinically-inspired, plant-based nutraceuticals for radiant skin, healthy hair, and total daily wellness. FSSAI approved, GMP certified.',
  keywords: ['nutraceuticals', 'plant-based wellness', 'skincare supplements', 'haircare supplements', 'daily wellness', 'ActiveWell Pharma'],
  authors: [{ name: 'ActiveWell Pharma' }],
  creator: 'ActiveWell Pharma',
  publisher: 'ActiveWell Pharma',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'ActiveWell Pharma',
    title: 'ActiveWell Pharma | Premium Plant-Based Wellness',
    description: 'ActiveWell Pharma delivers clinically-inspired, plant-based nutraceuticals for radiant skin, healthy hair, and total daily wellness.',
    images: [
      {
        url: '/og-image.png', // Fallback OG image
        width: 1200,
        height: 630,
        alt: 'ActiveWell Pharma - Premium Plant-Based Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ActiveWell Pharma | Premium Plant-Based Wellness',
    description: 'ActiveWell Pharma delivers clinically-inspired, plant-based nutraceuticals for radiant skin, healthy hair, and total daily wellness.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Synchronous — no async, no cookies(), no DB calls
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.variable}>
        <ClientErrorBoundary>
          {/* initialUser and initialProfile omitted — both default to null.
              UserProvider resolves auth client-side via onAuthStateChange. */}
          <UserProvider>
            <CartProvider>
              <ConditionalNavbar />
              {children}
              <Toaster position="top-right" />
            </CartProvider>
          </UserProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  )
}
