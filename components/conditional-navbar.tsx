'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import NavbarMobile from '@/components/navbar-mobile'

export function ConditionalNavbar() {
    const pathname = usePathname()

    // Don't show navbar on admin pages
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <>
            <Navbar />
            <NavbarMobile />
        </>
    )
}
