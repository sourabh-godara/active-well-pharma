'use client'

import { Home, ShoppingCart, User, LogIn, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/app/context/user-context'

const TABS = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/shop' },
  { icon: ShoppingCart, label: 'Cart', href: '/cart' },
] as const

export default function NavbarMobile(): React.JSX.Element {
  const { profile } = useUser()
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 safe-area-inset-bottom"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-foreground/50 hover:text-foreground/80'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                aria-hidden="true"
              />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          )
        })}

        {/* Account tab */}
        <Link
          href={profile ? '/profile' : '/auth/login'}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors duration-200 ${
            pathname === '/profile' ? 'text-primary' : 'text-foreground/50 hover:text-foreground/80'
          }`}
          aria-label={profile ? 'Account' : 'Log in'}
        >
          {profile
            ? <User className="w-5 h-5" aria-hidden="true" />
            : <LogIn className="w-5 h-5" aria-hidden="true" />}
          <span className="text-[10px] font-semibold tracking-wide">
            {profile ? 'Account' : 'Login'}
          </span>
        </Link>
      </div>
    </nav>
  )
}
