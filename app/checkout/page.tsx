'use client'

import { useCart } from '@/app/context/cart-context'
import { placeOrderFree } from './actions'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { Loader2, Gift, CheckCircle2, ShieldCheck, HeadphonesIcon, Tag, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutAddressPicker } from '@/components/checkout-address-picker'
import { getAddresses } from '@/app/actions/address'
import type { Address } from '@/types/address'
import { applyCoupon } from '@/app/actions/apply-coupon'
import type { ApplyCouponSuccess } from '@/types/coupon'
import { getStoreSettings, type StoreSettings } from '@/app/actions/admin/settings'
import { AddressForm } from '@/components/address-form'
import { createClient } from '@/lib/supabase/client'

// ── Types ────────────────────────────────────────────────────

interface CreateOrderResponse {
    orderId: string;
    razorpayOrderId?: string;
    amount: number;
    currency: string;
    key_id: string;
    status: string;
    error?: string;
    code?: string;
    items?: Array<{ name: string; requested: number; available: number }>;
    guestTrackingToken?: string;
}

interface VerifyPaymentResponse {
    success: boolean;
    orderId?: string;
    error?: string;
}

// ── Component ────────────────────────────────────────────────

function CheckoutInner(): React.ReactElement {
    const { items, clearCart } = useCart()
    const router = useRouter()
    const params = useSearchParams()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [addressesLoaded, setAddressesLoaded] = useState(false)

    // Auth and Guest State
    const [isGuest, setIsGuest] = useState(false)
    const [authLoaded, setAuthLoaded] = useState(false)

    // Payment
    const [guestEmail, setGuestEmail] = useState<string | null>(null)

    const couponCode = params.get('coupon')
    const [couponResult, setCouponResult] = useState<ApplyCouponSuccess | null>(null)
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

    // Recompute subtotal from items to ensure accuracy
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalMRP = items.reduce((sum, item) => sum + (item.original_price ?? item.price) * item.quantity, 0)
    const discountAmount = couponResult?.discount ?? 0
    const itemSavings = totalMRP - subtotal
    const totalSavings = itemSavings + discountAmount

    const [settings, setSettings] = useState<StoreSettings | null>(null)
    useEffect(() => {
        getStoreSettings().then(setSettings)

        // Check auth status
        const supabase = createClient()
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setIsGuest(!session)
            setAuthLoaded(true)
        })
    }, [])

    const discountedSubtotal = Math.max(0, subtotal - discountAmount)
    let shipping = settings?.shipping_charge ?? 49
    if (settings && discountedSubtotal >= settings.free_shipping_threshold) {
        shipping = 0
    }

    const finalTotal = discountedSubtotal + shipping
    const isFreeOrder = finalTotal === 0 && subtotal > 0
    const couponId = couponResult?.couponId

    useEffect(() => {
        if (!couponCode) {
            setCouponResult(null)
            return
        }

        setIsValidatingCoupon(true)
        applyCoupon(couponCode, subtotal)
            .then((result) => {
                if (result.valid) {
                    setCouponResult(result)
                } else {
                    toast.error(`Coupon removed: ${result.message}`)
                    setCouponResult(null)
                }
            })
            .catch(() => {
                toast.error('Failed to validate coupon')
                setCouponResult(null)
            })
            .finally(() => setIsValidatingCoupon(false))
    }, [couponCode, subtotal])

    const loadGuestAddresses = useCallback(() => {
        try {
            const savedEmail = localStorage.getItem('guest_email')
            if (savedEmail && !guestEmail) setGuestEmail(savedEmail)

            const saved = localStorage.getItem('guest_addresses')
            const parsed = saved ? JSON.parse(saved) : []
            if (Array.isArray(parsed)) {
                setAddresses(parsed)
                setAddressesLoaded(true)
                return parsed
            }
        } catch (e) {
            console.error('Failed to parse guest addresses', e)
        }
        setAddresses([])
        setAddressesLoaded(true)
        return []
    }, [guestEmail])

    useEffect(() => {
        if (!authLoaded) return
        let active = true

        if (isGuest) {
            const parsed = loadGuestAddresses()
            const def = parsed.find((a: Address) => a.is_default) ?? parsed[0] ?? null
            setSelectedAddress(prev => prev ?? def)
            
            const handleStorage = (e: StorageEvent) => {
                if (e.key === 'guest_addresses') {
                    loadGuestAddresses()
                }
            }
            window.addEventListener('storage', handleStorage)
            return () => {
                active = false
                window.removeEventListener('storage', handleStorage)
            }
        } else {
            getAddresses().then((addrs) => {
                if (!active) return
                setAddresses(addrs)
                const def = addrs.find((a) => a.is_default) ?? addrs[0] ?? null
                setSelectedAddress(prev => prev ?? def)
                setAddressesLoaded(true)
            })
            return () => { active = false }
        }
    }, [authLoaded, isGuest, loadGuestAddresses])

    const handlePayment = async (): Promise<void> => {
        if (items.length === 0) {
            toast.error('Cart is empty')
            return
        }
        if (!selectedAddress) {
            toast.error('Please select a delivery address')
            return
        }

        if (isGuest) {
            if (!guestEmail) {
                toast.error('Please provide an email')
                return
            }
        }

        setIsProcessing(true)
        try {
            // ── Free order path (100% coupon discount) ───────────────
            if (isFreeOrder) {
                const result = await placeOrderFree(
                    items, 
                    couponId, 
                    !isGuest ? selectedAddress.id : undefined,
                    isGuest ? { name: selectedAddress.name, phone: selectedAddress.phone, email: guestEmail! } : undefined,
                    isGuest ? selectedAddress : undefined
                )
                if (result.success) {
                    clearCart()
                    toast.success('Order placed successfully!')
                    router.push('/orders')
                } else {
                    toast.error(result.error?.message ?? 'Failed to place order')
                }
                return
            }

            // ── Paid order path (Razorpay via API routes) ────────────

            const createRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                    couponId,
                    discountAmount,
                    deliveryAddressId: !isGuest ? selectedAddress.id : undefined,
                    ...(isGuest ? {
                        guestEmail: guestEmail || undefined,
                        guestName: selectedAddress.name,
                        guestPhone: selectedAddress.phone,
                        guestAddressData: selectedAddress
                    } : {})
                }),
            })

            const createData: CreateOrderResponse = await createRes.json()

            if (!createRes.ok) {
                if (createData.code === 'INSUFFICIENT_STOCK' && createData.items) {
                    const names = createData.items.map((i) => i.name).join(', ')
                    toast.error(`Out of stock: ${names}`)
                } else {
                    toast.error(createData.error ?? 'Failed to create order')
                }
                return
            }

            if (createData.status && createData.status !== 'created') {
                if (createData.status === 'paid' || createData.status === 'confirmed') {
                    clearCart()
                    toast.info('This order has already been paid.')
                    if (createData.guestTrackingToken) {
                        router.push(`/track/${createData.guestTrackingToken}`)
                    } else {
                        router.push('/orders')
                    }
                } else {
                    toast.error('This order is no longer valid. Please try again.')
                    router.push('/cart')
                }
                return
            }

            const options = {
                key: createData.key_id,
                amount: createData.amount,
                currency: createData.currency,
                name: 'ActiveWell Pharma',
                description: 'Order Payment',
                order_id: createData.razorpayOrderId,
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) => {
                    setIsVerifying(true)
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })

                        const verifyData: VerifyPaymentResponse = await verifyRes.json()

                        if (verifyRes.ok && verifyData.success) {
                            clearCart()
                            toast.success('Payment successful! Order confirmed.')
                            if (createData.guestTrackingToken) {
                                router.push(`/track/${createData.guestTrackingToken}`)
                            } else {
                                router.push('/orders')
                            }
                        } else {
                            toast.error(verifyData.error ?? 'Payment verification failed')
                        }
                    } catch {
                        toast.error('Payment verification failed. Your payment is safe — please check your orders.')
                    } finally {
                        setIsVerifying(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.info('Payment was cancelled. You can try again.')
                        setIsProcessing(false)
                    },
                },
                prefill: {
                    name: selectedAddress.name,
                    contact: selectedAddress.phone,
                },
                theme: { color: '#16a34a' },
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const RazorpayConstructor = (window as unknown as Record<string, unknown>).Razorpay as new (opts: Record<string, unknown>) => { open: () => void }
            const rzp1 = new RazorpayConstructor(options)
            rzp1.open()

        } catch {
            toast.error('Failed to initiate payment')
        } finally {
            if (!isVerifying) {
                setIsProcessing(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />



            <main className="mx-auto max-w-7xl px-4 py-8 pb-24 lg:pb-8 sm:px-6 lg:px-8 w-full flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Left Column: Delivery Address ── */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">


                            <h2 className="text-lg pb-3 font-bold text-gray-900">Delivery Address</h2>


                            {addressesLoaded ? (
                                <CheckoutAddressPicker
                                    addresses={addresses}
                                    selected={selectedAddress}
                                    onSelect={setSelectedAddress}
                                    isGuestCheckout={isGuest}
                                    onAddressAdded={(addr, email, replacedId) => {
                                        if (isGuest) {
                                            let current: Address[] = [];
                                            try {
                                                const saved = localStorage.getItem('guest_addresses')
                                                const parsed = saved ? JSON.parse(saved) : []
                                                if (Array.isArray(parsed)) current = parsed
                                            } catch(e) {}

                                            let updated = current;
                                            if (replacedId) {
                                                updated = current.map((a: Address) => a.id === replacedId ? addr : a)
                                            } else {
                                                updated = [addr, ...current]
                                            }

                                            localStorage.setItem('guest_addresses', JSON.stringify(updated))
                                            if (email) {
                                                localStorage.setItem('guest_email', email)
                                                setGuestEmail(email)
                                            }
                                            setAddresses(updated)
                                        } else {
                                            setAddresses(prev => {
                                                if (replacedId) {
                                                    return prev.map(a => a.id === replacedId ? addr : a)
                                                }
                                                return [addr, ...prev]
                                            })
                                        }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading addresses…
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right Column: Order Summary ── */}
                    <div className="lg:col-span-5 space-y-6 sticky top-8">
                        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                                    <Link href="/cart" className="text-sm font-medium text-green-700 hover:underline">Edit Cart</Link>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            {item.image_url ? (
                                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                                    <Image src={item.image_url} alt={item.name} fill unoptimized className="object-contain" />
                                                </div>
                                            ) : (
                                                <div className="h-16 w-16 shrink-0 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{item.name}</h4>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <span className="text-xs font-medium text-gray-500">Qty: {item.quantity}</span>
                                                    <span className="text-sm font-extrabold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Breakdowns */}
                                <div className="border-t border-gray-100 pt-5 space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <dt>Subtotal</dt>
                                        <dd className="text-gray-900 font-semibold">₹{subtotal.toLocaleString('en-IN')}</dd>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-green-700 font-medium">
                                            <dt>Coupon discount</dt>
                                            <dd className="font-semibold">−₹{discountAmount.toLocaleString('en-IN')}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <dt>Shipping Charges</dt>
                                        <dd className={`font-semibold ${shipping === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                                        </dd>
                                    </div>
                                </div>

                                {/* Free Shipping Progress */}
                                {settings && shipping > 0 && (
                                    <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-white rounded p-1 border border-gray-200 shadow-sm">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                            </div>
                                            <p className="text-xs font-medium text-gray-600">
                                                Add <span className="font-bold text-gray-900">₹{(settings.free_shipping_threshold - discountedSubtotal).toLocaleString('en-IN')}</span> more to unlock FREE delivery
                                            </p>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-600 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${Math.min(100, (discountedSubtotal / settings.free_shipping_threshold) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">₹{settings.free_shipping_threshold} more</p>
                                    </div>
                                )}

                                {settings && shipping === 0 && (
                                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 flex items-center justify-center gap-2">
                                        <Gift className="h-4 w-4 text-green-700 shrink-0" />
                                        <p className="text-xs text-green-800 font-medium">
                                            You have unlocked Free Delivery!
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between">
                                    <span className="text-base font-extrabold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-extrabold text-green-700">
                                        {isFreeOrder ? 'FREE' : `₹${finalTotal.toLocaleString('en-IN')}`}
                                    </span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Tag className="h-3.5 w-3.5 text-green-600" />
                                        <p className="text-xs font-semibold text-green-700">
                                            You're saving ₹{totalSavings.toLocaleString('en-IN')} on this order
                                        </p>
                                    </div>
                                )}

                                {/* ── Verifying state ── */}
                                {isVerifying && (
                                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-3 mt-5">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
                                        <p className="text-xs text-blue-700 font-medium">
                                            Payment received, confirming your order…
                                        </p>
                                    </div>
                                )}

                                <button
                                    id="checkout-pay-button"
                                    onClick={handlePayment}
                                    disabled={isProcessing || isVerifying || isValidatingCoupon || items.length === 0 || !selectedAddress || (!authLoaded)}
                                    className="w-full mt-6 rounded-lg bg-green-700 px-4 py-3.5 text-sm font-bold text-white shadow hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isProcessing || isVerifying || isValidatingCoupon || !authLoaded
                                        ? <><Loader2 className="h-4 w-4 animate-spin" />Processing…</>
                                        : isFreeOrder ? 'Place Order (Free)' : 'Pay Now'
                                    }
                                </button>

                                {!isFreeOrder && (
                                    <p className="text-[11px] text-center text-gray-400 mt-3 font-medium">
                                        Powered by Razorpay · Secure payment
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer Trust Badges ── */}
            <footer className="hidden md:block border-t border-gray-200 bg-white py-8 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Genuine Products</h4>
                                <p className="text-xs text-gray-500 mt-0.5">100% original & authentic</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Secure Payments</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Razorpay trusted gateway</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                                <HeadphonesIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">24/7 Support</h4>
                                <p className="text-xs text-gray-500 mt-0.5">We're here to help</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default function CheckoutForm(): React.ReactElement {
    return (
        <Suspense>
            <CheckoutInner />
        </Suspense>
    )
}
