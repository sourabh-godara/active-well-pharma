
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { UserNav } from './user-nav'

export function Navbar() {

    return (
        <nav className="border-b bg-white hidden lg:block">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
                            ActiveWell<span className="text-secondary"> Pharma</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <Link href="/cart" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                            <ShoppingCart className="h-6 w-6" />
                        </Link>

                        <UserNav />
                    </div>
                </div>
            </div>
        </nav>
    )
}
