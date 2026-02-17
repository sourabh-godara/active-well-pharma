'use client'
import { Home, ShoppingCart, User, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/app/context/user-context'

export default function NavbarMobile() {
    const { profile } = useUser()

    return (
        <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50'>
            <div className='flex justify-between mx-6 items-center h-16 px-4'>
                <Link href="/" className='flex items-center gap-2'>
                    <Home className='h-6 w-6 text-gray-500 hover:text-gray-900' />
                </Link>
                <Link href="/cart" className='flex items-center gap-2'>
                    <ShoppingCart className='h-6 w-6 text-gray-500 hover:text-gray-900' />
                </Link>
                {profile ? (
                    <Link href="/profile" className='flex items-center gap-2'>
                        <User className='h-6 w-6 text-gray-500 hover:text-gray-900' />
                    </Link>
                ) : (
                    <Link href="/auth/login" className='flex items-center gap-2'>
                        <LogIn className='h-6 w-6 text-gray-500 hover:text-gray-900' />
                    </Link>
                )}
            </div>
        </div>
    )
}
