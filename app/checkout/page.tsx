'use client'

import { useCart } from '@/app/context/cart-context'
import { createOrder, verifyPayment } from './actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { toast } from 'sonner'


export default function CheckoutForm() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = async () => {
        if (items.length === 0) {
            toast.error('Cart is empty')
            return
        }

        setIsProcessing(true)
        try {
            // 1. Create Order on Server
            const { orderId, amount, currency } = await createOrder(total)

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // We need to expose this
                amount: amount,
                currency: currency,
                name: 'PharmaStore',
                description: 'Order Payment',
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment on Server
                        const result = await verifyPayment(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature,
                            items,
                            total
                        )

                        if (result.success) {
                            clearCart()
                            toast.success('Order placed successfully!')
                            router.push('/dashboard')
                        }
                    } catch (error) {
                        toast.error('Payment verification failed')
                        console.error(error)
                    }
                },
                prefill: {
                    name: 'Test User', // Ideally from Auth
                    email: 'test@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#4f46e5',
                },
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
            {/* Navbar is in parent page */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Complete your purchase securely.
                    </p>
                </div>

                <div className="mt-12 bg-white shadow rounded-lg p-8 mx-auto max-w-xl">
                    <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
                        <div className="flex items-center justify-between">
                            <dt className="text-gray-600">Total Amount</dt>
                            <dd className="text-3xl font-bold text-indigo-600">${total.toFixed(2)}</dd>
                        </div>
                    </dl>

                    <div className="mt-8">
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || items.length === 0}
                            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                        >
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-center text-gray-400">
                        This is a test payment integration.
                    </p>
                </div>
            </main>
        </div>
    )
}
