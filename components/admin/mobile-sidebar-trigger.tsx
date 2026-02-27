'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { AdminSidebarContent } from './admin-sidebar'

// Mobile-only hamburger + Sheet drawer
export function MobileSidebarTrigger() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
                onClick={() => setOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64 p-0 border-r">
                    <AdminSidebarContent />
                </SheetContent>
            </Sheet>
        </>
    )
}
