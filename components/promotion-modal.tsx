
'use client'

import { useEffect, useState } from 'react'
import { Promotion } from '@/types'
import { markPromotionAsSeen } from '@/lib/actions/promotion.actions'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export function PromotionModal({ promotion }: { promotion: Promotion | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [hasSeen, setHasSeen] = useState(true) // Default to true to prevent flash

    useEffect(() => {
        if (!promotion) return

        const checkSeen = async () => {
            // 1. Check LocalStorage (Guest)
            const localSeen = localStorage.getItem(`promo_seen_${promotion.id}`)
            if (localSeen) {
                setHasSeen(true)
                return
            }

            // 2. Check DB (User) - Server action passed null if seen, but here we double check or just rely on parent.
            // actually getActivePromotion server action already checks DB for logged in user.
            // So if promotion is provided here, it means server thinks user hasn't seen it (or is guest).
            // But we still need to check localStorage for guest consistency.

            setHasSeen(false)

            // Trigger Logic
            if (promotion.trigger_type === 'on_load') {
                setIsOpen(true)
            } else if (promotion.trigger_type === 'time_delay') {
                setTimeout(() => {
                    setIsOpen(true)
                }, (promotion.delay_seconds || 0) * 1000)
            } else if (promotion.trigger_type === 'exit_intent') {
                const onMouseLeave = (e: MouseEvent) => {
                    if (e.clientY <= 0) {
                        setIsOpen(true)
                        document.removeEventListener('mouseleave', onMouseLeave)
                    }
                }
                document.addEventListener('mouseleave', onMouseLeave)
                return () => document.removeEventListener('mouseleave', onMouseLeave)
            }
        }

        checkSeen()
    }, [promotion])

    const handleClose = async () => {
        setIsOpen(false)
        if (promotion) {
            localStorage.setItem(`promo_seen_${promotion.id}`, 'true')
            await markPromotionAsSeen(promotion.id) // Fire and forget
        }
    }

    if (!promotion || hasSeen || !isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transform transition-transform duration-300 scale-100">
                <button
                    onClick={handleClose}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {promotion.image_url && (
                    <div className="relative h-48 w-full">
                        <Image
                            src={promotion.image_url}
                            alt={promotion.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{promotion.title}</h2>
                    <p className="text-gray-600 mb-6">{promotion.description}</p>

                    {promotion.coupon_code && (
                        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-3 inline-block">
                            <p className="text-xs text-indigo-600 uppercase font-semibold tracking-wider mb-1">Use Code</p>
                            <code className="text-xl font-mono font-bold text-indigo-700 select-all cursor-pointer" onClick={() => { navigator.clipboard.writeText(promotion.coupon_code!); alert('Copied!') }}>
                                {promotion.coupon_code}
                            </code>
                        </div>
                    )}

                    <button
                        onClick={handleClose}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        </div>
    )
}
