// app/layout.tsx
// No cookies() — no server auth — layout is now fully static.
// UserProvider hydrates auth entirely client-side via onAuthStateChange.
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { CartProvider } from './context/cart-context'
import { ConditionalNavbar } from '@/components/conditional-navbar'
import { UserProvider } from './context/user-context'
import { ClientErrorBoundary } from '@/components/error-boundaries'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ActiveWell Pharma',
  description: 'Activewell Pharma delivers innovative, easy-to-use nutraceutical solutions that support immunity, energy, and everyday wellness.',
}

// Synchronous — no async, no cookies(), no DB calls
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
