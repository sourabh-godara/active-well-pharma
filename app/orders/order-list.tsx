'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const channel = supabase
            .channel('realtime-orders')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    setOrders((currentOrders) =>
                        currentOrders.map((order) =>
                            order.id === payload.new.id ? { ...order, ...payload.new } : order
                        )
                    )
                    toast('Order status updated: ' + payload.new.status)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Order ID: <span className="font-mono text-gray-900">{order.id}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Date: {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'delivered'
                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                    : order.status === 'cancelled'
                                        ? 'bg-red-50 text-red-700 ring-red-600/20'
                                        : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                    }`}
                            >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-lg font-bold text-gray-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <ul className="divide-y divide-gray-200 mt-4">
                        {order.order_items.map((item: any) => (
                            <li key={item.id} className="py-4 flex gap-4">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {item.product?.image_url && (
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product?.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <Link href={`/product/${item.product_id}`}>{item.product?.name}</Link>
                                        </h3>
                                        <p className="ml-4">₹{Number(item.price_at_purchase).toLocaleString('en-IN')}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
