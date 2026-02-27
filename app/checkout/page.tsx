'use client'

import { useCart } from '@/app/context/cart-context'
import { createOrder, verifyPayment, placeOrderFree } from './actions'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { Loader2, Gift } from 'lucide-react'
import { CheckoutAddressPicker } from '@/components/checkout-address-picker'
import { getAddresses } from '@/app/actions/address'
import type { Address } from '@/types/address'

function CheckoutInner() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const params = useSearchParams()
    const [isProcessing, setIsProcessing] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [addressesLoaded, setAddressesLoaded] = useState(false)

    // Coupon data passed from cart page via query params
    const couponId = params.get('couponId') ?? undefined
    const discountAmount = params.get('discount') ? Number(params.get('discount')) : undefined
    const couponTotal = params.get('total') ? Number(params.get('total')) : undefined

    // Use server-verified total if coupon applied, otherwise fall back to cart total
    const finalTotal = couponTotal ?? total
    const isFreeOrder = finalTotal === 0

    // Fetch saved addresses on mount
    useEffect(() => {
        getAddresses().then(addrs => {
            setAddresses(addrs)
            // Auto-select default address if available
            const def = addrs.find(a => a.is_default) ?? addrs[0] ?? null
            setSelectedAddress(def)
            setAddressesLoaded(true)
        })
    }, [])

    const handlePayment = async () => {
        if (items.length === 0) {
            toast.error('Cart is empty')
            return
        }
        if (!selectedAddress) {
            toast.error('Please select a delivery address')
            return
        }

        setIsProcessing(true)
        try {
            // ── Free order path (100% coupon discount) ───────────────
            if (isFreeOrder) {
                const result = await placeOrderFree(items, couponId, discountAmount, selectedAddress.id)
                if (result.success) {
                    clearCart()
                    toast.success('Order placed successfully!')
                    router.push('/orders')
                } else {
                    toast.error(result.error.message)
                }
                return
            }

            // ── Paid order path (Razorpay) ────────────────────────────
            const response = await createOrder(finalTotal)

            if (!response.success || !response.data) {
                toast.error(response.success ? 'Failed to create order: No data received' : response.error.message)
                setIsProcessing(false)
                return
            }

            const { orderId, amount, currency } = response.data

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'ActiveWell Pharma',
                description: 'Order Payment',
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        const result = await verifyPayment(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature,
                            items,
                            finalTotal,
                            couponId,
                            discountAmount,
                            selectedAddress.id
                        )

                        if (result.success) {
                            clearCart()
                            toast.success('Order placed successfully!')
                            router.push('/orders')
                        } else {
                            toast.error(result.error.message)
                        }
                    } catch (error) {
                        toast.error('Payment verification failed')
                        console.error(error)
                    }
                },
                prefill: {
                    name: selectedAddress.name,
                    contact: selectedAddress.phone,
                },
                theme: { color: '#16a34a' },
            }

            const rzp1 = new (window as any).Razorpay(options)
            rzp1.open()

        } catch (error) {
            console.error(error)
            toast.error('Failed to initiate payment')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
                    <p className="mt-2 text-lg leading-8 text-gray-600">Complete your purchase securely.</p>
                </div>

                <div className="mt-12 bg-white shadow rounded-lg p-8 mx-auto max-w-xl space-y-5">

                    {/* ── Address Section ── */}
                    {addressesLoaded ? (
                        <CheckoutAddressPicker
                            addresses={addresses}
                            selected={selectedAddress}
                            onSelect={setSelectedAddress}
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading addresses…
                        </div>
                    )}

                    <div className="border-t pt-5">
                        {/* ── Order Summary ── */}
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <dt>Subtotal</dt>
                                <dd>₹{total.toLocaleString('en-IN')}</dd>
                            </div>
                            {discountAmount && discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <dt>Coupon discount</dt>
                                    <dd>−₹{discountAmount.toLocaleString('en-IN')}</dd>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <dt>Shipping</dt>
                                <dd className="text-green-600 font-semibold">FREE</dd>
                            </div>
                        </dl>

                        <div className="border-t mt-3 pt-4 flex items-center justify-between">
                            <span className="text-base font-bold text-gray-900">Total Amount</span>
                            <span className="text-3xl font-bold text-green-600">
                                {isFreeOrder ? 'FREE' : `₹${finalTotal.toLocaleString('en-IN')}`}
                            </span>
                        </div>

                        {isFreeOrder && (
                            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 mt-3">
                                <Gift className="h-4 w-4 text-green-600 shrink-0" />
                                <p className="text-xs text-green-700 font-medium">
                                    Your coupon covers the full amount — no payment needed!
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || items.length === 0 || !selectedAddress}
                            className="w-full mt-5 rounded-full bg-green-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isProcessing
                                ? <><Loader2 className="h-4 w-4 animate-spin" />Processing…</>
                                : isFreeOrder ? 'Place Order (Free)' : 'Pay Now'
                            }
                        </button>
                        {!isFreeOrder && (
                            <p className="text-xs text-center text-gray-400 mt-2">
                                Powered by Razorpay · Secure payment
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CheckoutForm() {
    return (
        <Suspense>
            <CheckoutInner />
        </Suspense>
    )
}
