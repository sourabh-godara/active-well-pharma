'use client'

import { useCart } from '@/app/context/cart-context'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import {
    Minus,
    Plus,
    X,
    Tag,
    ArrowLeft,
    ShoppingBag,
    CheckCircle2,
    Loader2,
    TriangleAlert,
    Lock,
    Shield,
    Truck,
    Leaf,
    Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { applyCoupon } from '@/app/actions/apply-coupon'
import type { ApplyCouponSuccess } from '@/types/coupon'
import { getStoreSettings, type StoreSettings } from '@/app/actions/admin/settings'
import { toast } from 'sonner'

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCart()
    const [couponCode, setCouponCode] = useState('')
    const [couponResult, setCouponResult] = useState<ApplyCouponSuccess | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [isRevalidating, setIsRevalidating] = useState(false)

    // Tracks the subtotal the current coupon was last validated against, so
    // we only re-check it when the cart actually changes underneath it.
    const lastValidatedSubtotal = useRef<number | null>(null)

    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    )

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    )

    // Savings from product-level discounts (original_price vs price)
    const productSavings = useMemo(
        () =>
            items.reduce((sum, item) => {
                if (item.original_price && item.original_price > item.price) {
                    return sum + (item.original_price - item.price) * item.quantity
                }
                return sum
            }, 0),
        [items]
    )

    const [settings, setSettings] = useState<StoreSettings | null>(null)

    useEffect(() => {
        getStoreSettings().then(setSettings)
    }, [])

    const couponDiscount = couponResult?.discount ?? 0
    const discountedSubtotal = Math.max(0, subtotal - couponDiscount)
    
    let shipping = settings?.shipping_charge ?? 49
    if (settings && discountedSubtotal >= settings.free_shipping_threshold) {
        shipping = 0
    }

    const total = discountedSubtotal + shipping
    const totalSavings = productSavings + couponDiscount

    // A coupon's rupee value (percentage-based) or its eligibility
    // (min order amount) depends on the subtotal. If quantities change
    // while a coupon is applied, re-run it against the server instead of
    // trusting the number we got back at a different subtotal.
    useEffect(() => {
        if (!couponResult) return
        if (lastValidatedSubtotal.current === subtotal) return

        setIsRevalidating(true)
        applyCoupon(couponResult.couponCode, subtotal)
            .then((result) => {
                if (result.valid) {
                    setCouponResult(result)
                    lastValidatedSubtotal.current = subtotal
                } else {
                    setCouponResult(null)
                    setCouponError(result.message)
                    toast.error(`Coupon removed: ${result.message}`)
                }
            })
            .finally(() => setIsRevalidating(false))
        // Only re-run when subtotal moves; couponResult itself is the thing
        // being updated inside this effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtotal])

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return
        startTransition(async () => {
            const result = await applyCoupon(couponCode, subtotal)
            if (result.valid) {
                setCouponResult(result)
                lastValidatedSubtotal.current = subtotal
                setCouponError(null)
                setCouponCode('')
            } else {
                setCouponResult(null)
                setCouponError(result.message)
            }
        })
    }

    const handleRemoveCoupon = () => {
        setCouponResult(null)
        setCouponCode('')
        setCouponError(null)
        lastValidatedSubtotal.current = null
    }

    // ── Empty state ──────────────────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
                <div className="text-center space-y-5">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                        <p className="text-gray-500 mt-1 text-sm">Add some products to get started.</p>
                    </div>
                    <Button asChild className="rounded-full bg-green-600 hover:bg-green-700 text-white px-8">
                        <Link href="/shop">Browse Products</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="font-display text-4xl font-bold text-[#0f3d24]">
                        Your Cart{' '}
                        <span className="text-green-600 text-xl font-semibold">
                            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                        </span>
                    </h1>
                    <p className="flex items-center gap-1.5 text-gray-500 mt-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        Trusted by thousands for quality and results
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── Left: Cart Items ─────────────────────────── */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden py-0">
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100">
                                    {items.map((item) => {
                                        const lineTotal = item.price * item.quantity
                                        const hasDiscount = item.original_price && item.original_price > item.price
                                        const discountPct = hasDiscount
                                            ? Math.round(
                                                ((item.original_price! - item.price) / item.original_price!) * 100
                                            )
                                            : 0
                                        const atMinQuantity = item.quantity <= 1

                                        return (
                                            <div key={item.id} className="p-4 sm:p-5">
                                                <div className="flex gap-4">
                                                    <div className="relative h-32 w-24 sm:h-40 sm:w-28 shrink-0 rounded-xl overflow-hidden bg-[#f4f7f5] border border-gray-100">
                                                        {item.image_url && item.image_url.trim() !== '' ? (
                                                            <Image
                                                                src={item.image_url}
                                                                alt={item.name}
                                                                fill
                                                                unoptimized
                                                                className="object-cover mix-blend-multiply"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <ShoppingBag className="h-8 w-8 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex flex-1 flex-col">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/product/${item.id}`}
                                                                    className="font-semibold text-gray-900 hover:text-green-600 transition-colors text-sm sm:text-base leading-tight"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                                    <span className="text-sm font-semibold text-gray-900">
                                                                        ₹{item.price.toLocaleString('en-IN')}
                                                                    </span>
                                                                    {hasDiscount && (
                                                                        <>
                                                                            <span className="text-xs text-gray-400 line-through">
                                                                                ₹{item.original_price!.toLocaleString('en-IN')}
                                                                            </span>
                                                                            <span className="text-[10px] font-semibold text-green-700 bg-green-50 rounded px-1.5 py-0.5">
                                                                                {discountPct}% OFF
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1 rounded-full hover:bg-red-50"
                                                                aria-label={`Remove ${item.name} from cart`}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        {/* Qty stepper + line total */}
                                                        <div className="mt-3 flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-1 rounded-full border border-gray-200 px-1 py-0.5 bg-white">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={atMinQuantity}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                                    aria-label="Decrease quantity"
                                                                    title={atMinQuantity ? 'Use the × button to remove this item' : undefined}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <span className="font-bold text-gray-900 text-sm sm:text-base">
                                                                ₹{lineTotal.toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Right: Order Summary ──────────────────────── */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="space-y-5">
                                <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

                                {/* Coupon input */}
                                {couponResult ? (
                                    <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            {isRevalidating ? (
                                                <Loader2 className="h-4 w-4 text-green-600 shrink-0 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                            )}
                                            <div>
                                                <p className="text-xs font-semibold text-green-700">{couponResult.couponCode}</p>
                                                <p className="text-[10px] text-green-600">
                                                    −₹{couponResult.discount.toLocaleString('en-IN')} saved
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-green-600 hover:text-red-500 transition-colors"
                                            aria-label="Remove coupon"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={couponCode}
                                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                    onKeyDown={e => { if (e.key === 'Enter') handleApplyCoupon() }}
                                                    placeholder="Coupon code"
                                                    className={`pl-9 rounded-full text-sm ${couponError ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200'}`}
                                                    disabled={isPending}
                                                />
                                            </div>
                                            <Button
                                                size="sm"
                                                className="rounded-full text-sm font-semibold px-4 shrink-0 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-none"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode.trim() || isPending}
                                            >
                                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                                            </Button>
                                        </div>
                                        {couponError && (
                                            <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
                                                <TriangleAlert className="h-3 w-3 shrink-0" />
                                                {couponError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <Separator />

                                {/* Line items */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span className="flex items-center gap-1">
                                                Coupon
                                                <span className="text-[10px] bg-green-100 text-green-700 rounded px-1 font-semibold">
                                                    {couponResult?.couponCode}
                                                </span>
                                            </span>
                                            <span className="font-medium text-green-600">−₹{couponDiscount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-300" />

                                {/* Total */}
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-base">Total</span>
                                    <span className="font-bold text-gray-900 text-xl">
                                        ₹{total.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* Savings banner */}
                                {totalSavings > 0 && (
                                    <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-center">
                                        <span className="text-xs font-semibold text-green-700">
                                            You're saving ₹{totalSavings.toLocaleString('en-IN')} on this order
                                        </span>
                                    </div>
                                )}

                                {/* CTA — cart contents live in context/localStorage, so
                                    checkout can recompute subtotal itself; we only pass
                                    the coupon code and let it re-validate server-side
                                    rather than trusting an amount from the URL. */}
                                <Button
                                    asChild
                                    className="w-full rounded-full h-12 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                    <Link
                                        href={
                                            couponResult
                                                ? `/checkout?coupon=${encodeURIComponent(couponResult.couponCode)}`
                                                : '/checkout'
                                        }
                                    >
                                        <Lock className="h-4 w-4" />
                                        Proceed to Checkout
                                    </Link>
                                </Button>

                                <p className="text-center text-[11px] text-gray-400">
                                    Secure checkout powered by Razorpay
                                </p>

                                <Link
                                    href="/shop"
                                    className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Continue Shopping
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>


            </main>
        </div>
    )
}
