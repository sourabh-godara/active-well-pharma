
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
import { Navbar } from '@/components/navbar'
import NavbarMobile from '@/components/navbar-mobile'
import { UserProvider } from './context/user-context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <Navbar />
            {children}
            <NavbarMobile />
            <Toaster position="top-right" />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
