
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Store',
  description: 'Your trusted online store',
}

import { CartProvider } from './context/cart-context'
import { ConditionalNavbar } from '@/components/conditional-navbar'
import { UserProvider } from './context/user-context'
import { ClientErrorBoundary } from '@/components/error-boundaries'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientErrorBoundary>
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
