'use client'

import { useState, useTransition } from 'react'
import { toggleCoupon, deleteCoupon } from '@/app/actions/apply-coupon'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MoreHorizontal, Power, Trash2 } from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface CouponActionsProps {
    id: string
    isActive: boolean
    code: string
}

export function CouponActions({ id, isActive, code }: CouponActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [active, setActive] = useState(isActive)

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleCoupon(id, active)
            if (result.success) {
                setActive(prev => !prev)
                toast.success(`Coupon ${active ? 'disabled' : 'enabled'}`)
            } else {
                toast.error(result.error ?? 'Failed to update coupon')
            }
        })
    }

    const handleDelete = () => {
        if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
        startTransition(async () => {
            const result = await deleteCoupon(id)
            if (result.success) {
                toast.success('Coupon deleted')
            } else {
                toast.error(result.error ?? 'Failed to delete coupon')
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending} className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleToggle} className="gap-2 cursor-pointer">
                    <Power className="h-4 w-4" />
                    {active ? 'Disable' : 'Enable'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
