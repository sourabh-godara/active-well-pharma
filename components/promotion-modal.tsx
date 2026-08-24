'use client'

import { useEffect, useState, useCallback } from 'react'
import { Promotion } from '@/types'
import { markPromotionAsSeen } from '@/lib/actions/promotion.actions'
import { X, Copy, Check, ArrowRight, Leaf } from 'lucide-react'

const COPY_FEEDBACK_DURATION_MS = 2000

export function PromotionModal({ promotion }: { promotion: Promotion | null }): React.ReactElement | null {
    const [isOpen, setIsOpen] = useState(false)
    const [hasSeen, setHasSeen] = useState(true) // Default to true to prevent flash
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!promotion) return

        const checkSeen = () => {
            // Check LocalStorage (Guest)
            const localSeen = localStorage.getItem(`promo_seen_${promotion.id}`)
            if (localSeen) {
                setHasSeen(true)
                return
            }

            // If promotion is provided here, server already validated it's unseen
            setHasSeen(false)

            // Trigger Logic
            if (promotion.trigger_type === 'on_load') {
                setIsOpen(true)
            } else if (promotion.trigger_type === 'time_delay') {
                const timer = setTimeout(() => {
                    setIsOpen(true)
                }, (promotion.delay_seconds || 0) * 1000)
                return () => clearTimeout(timer)
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

        const cleanup = checkSeen()
        return () => { cleanup?.() }
    }, [promotion])

    const handleClose = useCallback(async () => {
        setIsOpen(false)
        if (promotion) {
            localStorage.setItem(`promo_seen_${promotion.id}`, 'true')
            await markPromotionAsSeen(promotion.id)
        }
    }, [promotion])

    const handleCopyCode = useCallback(async () => {
        if (!promotion?.coupon_code) return
        await navigator.clipboard.writeText(promotion.coupon_code)
        setCopied(true)
        setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
    }, [promotion?.coupon_code])

    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }, [handleClose])

    if (!promotion || hasSeen || !isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={promotion.title}
        >
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    aria-label="Close promotion"
                >
                    <X className="h-4 w-4" strokeWidth={2.5} />
                </button>

                {/* Content */}
                <div className="px-8 pt-10 pb-8 text-center">

                    {/* Leaf icon circle */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-200 bg-green-50/80">
                        <Leaf className="h-7 w-7 text-green-600" strokeWidth={1.8} />
                    </div>

                    {/* Large coupon code title */}
                    {promotion.coupon_code ? (
                        <h2 className="mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
                            {promotion.coupon_code}
                        </h2>
                    ) : (
                        <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                            {promotion.title}
                        </h2>
                    )}

                    {/* Description */}
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-600">
                        <span className="mr-1">🌿</span>
                        {promotion.description}
                    </p>

                    {/* Coupon copy box */}
                    {promotion.coupon_code && (
                        <div className="mx-auto mt-6 max-w-xs">
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="group flex w-full items-center justify-between gap-3 rounded-xl border-2 border-dashed border-green-300 bg-green-50/50 px-5 py-4 transition-all hover:border-green-400 hover:bg-green-50"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-green-600/70">
                                        Use Code
                                    </span>
                                    <span className="mt-0.5 text-xl font-bold tracking-wide text-green-800">
                                        {promotion.coupon_code}
                                    </span>
                                </div>
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${copied
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                                    }`}>
                                    {copied
                                        ? <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
                                        : <Copy className="h-4.5 w-4.5" strokeWidth={2} />
                                    }
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Decorative divider */}
                    <div className="relative my-7 flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white">
                            <Leaf className="h-3.5 w-3.5 text-green-500" strokeWidth={2} />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:shadow-xl hover:shadow-green-600/30 hover:brightness-110 active:scale-[0.98]"
                    >
                        <span>Shop Now</span>
                        <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Bottom decorative wave */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-green-400 to-green-600 opacity-80" />
            </div>
        </div>
    )
}
