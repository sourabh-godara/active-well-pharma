'use client'

import { useCart } from '@/app/context/cart-context'
import { placeOrderFree } from './actions'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { Loader2, Gift } from 'lucide-react'
import { CheckoutAddressPicker } from '@/components/checkout-address-picker'
import { getAddresses } from '@/app/actions/address'
import type { Address } from '@/types/address'

// ── Types ────────────────────────────────────────────────────

interface CreateOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    key_id: string;
    status: string;
    error?: string;
    code?: string;
    items?: Array<{ name: string; requested: number; available: number }>;
}

interface VerifyPaymentResponse {
    success: boolean;
    orderId?: string;
    error?: string;
}

// ── Component ────────────────────────────────────────────────

function CheckoutInner(): React.ReactElement {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const params = useSearchParams()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
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
        getAddresses().then((addrs) => {
            setAddresses(addrs)
            // Auto-select default address if available
            const def = addrs.find((a) => a.is_default) ?? addrs[0] ?? null
            setSelectedAddress(def)
            setAddressesLoaded(true)
        })
    }, [])

    const handlePayment = async (): Promise<void> => {
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

            // ── Paid order path (Razorpay via API routes) ────────────

            // 1. Create order (server-side pricing, no client-supplied amount)
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
                    deliveryAddressId: selectedAddress.id,
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

            // Defensive: if the returned order isn't in 'created' state,
            // don't open the Razorpay modal — redirect appropriately
            if (createData.status && createData.status !== 'created') {
                if (createData.status === 'paid' || createData.status === 'confirmed') {
                    toast.info('This order has already been paid.')
                    router.push('/orders')
                } else {
                    toast.error('This order is no longer valid. Please try again.')
                    router.push('/cart')
                }
                return
            }

            // 2. Open Razorpay checkout modal
            const options = {
                key: createData.key_id,
                amount: createData.amount,
                currency: createData.currency,
                name: 'ActiveWell Pharma',
                description: 'Order Payment',
                order_id: createData.orderId,
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) => {
                    // 3. Verify payment (fast-path UX confirmation)
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
                            router.push('/orders')
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

                        {/* ── Verifying state ── */}
                        {isVerifying && (
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 mt-3">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
                                <p className="text-xs text-blue-700 font-medium">
                                    Payment received, confirming your order…
                                </p>
                            </div>
                        )}

                        <button
                            id="checkout-pay-button"
                            onClick={handlePayment}
                            disabled={isProcessing || isVerifying || items.length === 0 || !selectedAddress}
                            className="w-full mt-5 rounded-full bg-green-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isProcessing || isVerifying
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

export default function CheckoutForm(): React.ReactElement {
    return (
        <Suspense>
            <CheckoutInner />
        </Suspense>
    )
}
