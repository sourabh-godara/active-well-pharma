'use client'

import { useState } from 'react'
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react'
import { UserNav } from './user-nav'
import Link from 'next/link'
import { useCart } from '@/app/context/cart-context'
import { AnnouncementBar } from './announcement-bar'

const NAV_LINKS = [

  { label: 'Best Sellers', href: '/shop' },
  { label: 'Orders', href: '/orders' },
  { label: 'About', href: '/about' },
] as const

export const Navbar = (): React.JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      <AnnouncementBar />

      <nav
        className="container-brand flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl sm:text-2xl text-primary tracking-tight shrink-0"
          aria-label="ActiveWell Pharma — Home"
        >
          ActiveWell<span className="text-secondary">Pharma</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-7" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 relative pb-0.5 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1.5px] after:bottom-0 after:left-0 after:bg-primary after:origin-right after:transition-transform after:duration-200 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">

          <div className="hidden sm:block">
            <UserNav />
          </div>

          <Link
            href="/cart"
            className="relative p-2.5 text-foreground/60 hover:text-primary hover:bg-muted transition-colors duration-200 rounded-lg"
            aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <ShoppingBag className="w-[18px] h-[18px]" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-secondary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2.5 text-foreground/60 hover:text-primary hover:bg-muted transition-colors duration-200 rounded-lg ml-0.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-down" role="navigation" aria-label="Mobile navigation">
          <ul className="flex flex-col py-2 px-4" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center py-3 px-2 text-base font-medium text-foreground/70 hover:text-primary transition-colors duration-200 border-b border-border/50 last:border-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-border">
            <UserNav />
          </div>
        </div>
      )}
    </header>
  )
}
