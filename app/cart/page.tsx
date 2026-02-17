'use client'

import { useCart } from '@/app/context/cart-context'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart()

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

                <div className="mt-8">
                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg shadow">
                            <p className="text-gray-500 text-lg">Your cart is empty.</p>
                            <div className="mt-6">
                                <Link
                                    href="/"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                            <section className="lg:col-span-7">
                                <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex py-6 sm:py-10">
                                            <div className="flex-shrink-0">
                                                <div className="h-24 w-24 rounded-md border-gray-200 bg-gray-100 overflow-hidden">
                                                    {item.image_url && <img src={item.image_url} alt={item.name} className="h-full w-full object-cover object-center" />}
                                                </div>
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <h3 className="text-sm">
                                                                <Link href={`/product/${item.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                                                    {item.name}
                                                                </Link>
                                                            </h3>
                                                        </div>
                                                        <p className="mt-1 text-sm font-medium text-gray-900">${item.price}</p>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                                            Quantity, {item.name}
                                                        </label>
                                                        <select
                                                            id={`quantity-${item.id}`}
                                                            name={`quantity-${item.id}`}
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                        >
                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                                <option key={num} value={num}>
                                                                    {num}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <div className="absolute right-0 top-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                                            >
                                                                <span className="sr-only">Remove</span>
                                                                <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Order summary */}
                            <section
                                aria-labelledby="summary-heading"
                                className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                            >
                                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                                    Order summary
                                </h2>

                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                                        <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                                    </div>
                                </dl>

                                <div className="mt-6">
                                    <Link
                                        href="/checkout"
                                        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
