'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, MapPin, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function OrderRow({ order }: { order: any }) {
    const [status, setStatus] = useState(order.status)
    const [loading, startTransition] = useTransition()
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        startTransition(async () => {
            try {
                await updateOrderStatus(order.id, newStatus)
                toast.success('Status updated')
                router.refresh()
            } catch {
                toast.error('Failed to update status')
                setStatus(order.status)
            }
        })
    }

    const addr = order.delivery_address
    const items: any[] = order.order_items ?? []

    const formatAddr = (a: any) => {
        if (!a) return null
        return [a.name, a.address_line, a.locality, a.city, a.state, a.pincode]
            .filter(Boolean).join(', ')
    }

    return (
        <>
            {/* Main row */}
            <tr className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-mono text-gray-600 sm:pl-0">
                    {order.id.slice(0, 8)}…
                </td>
                <td className="px-3 py-4 text-sm">
                    <p className="font-medium text-gray-900">{order.profiles?.full_name || 'Unknown'}</p>
                    {order.profiles?.email && (
                        <p className="text-xs text-gray-400">{order.profiles.email}</p>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-800">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    {order.discount_amount > 0 && (
                        <span className="ml-1 text-xs text-green-600 font-normal">
                            (−₹{Number(order.discount_amount).toLocaleString('en-IN')})
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        disabled={loading}
                        className={`rounded-md border px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 ${STATUS_STYLES[status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </td>
                <td className="py-4 pl-3 pr-4 text-right sm:pr-0">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-0.5 ml-auto"
                    >
                        Details {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                </td>
            </tr>

            {/* Expanded detail row */}
            {expanded && (
                <tr className="bg-gray-50 border-t border-gray-100">
                    <td colSpan={6} className="px-4 pb-5 pt-3 sm:pl-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Delivery Address */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <MapPin className="h-3.5 w-3.5 text-green-600" /> Delivery Address
                                </h4>
                                {addr ? (
                                    <div className="text-sm space-y-0.5">
                                        <p className="font-medium text-gray-900">{addr.name}</p>
                                        <p className="text-gray-600">{formatAddr(addr)}</p>
                                        <p className="text-gray-400 text-xs">📞 {addr.phone}
                                            {addr.alt_phone ? ` / ${addr.alt_phone}` : ''}
                                        </p>
                                        {addr.landmark && (
                                            <p className="text-gray-400 text-xs">Landmark: {addr.landmark}</p>
                                        )}
                                        <Badge className="mt-1 text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-100">
                                            {addr.address_type}
                                        </Badge>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No address recorded</p>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <Package className="h-3.5 w-3.5 text-green-600" /> Items ({items.length})
                                </h4>
                                {items.length > 0 ? (
                                    <ul className="space-y-2">
                                        {items.map((item: any) => (
                                            <li key={item.id} className="flex items-center gap-3">
                                                {item.product?.image_url && (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product?.name}
                                                        className="h-10 w-10 rounded-md object-cover border border-gray-100 shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {item.product?.name ?? 'Unknown product'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Qty {item.quantity} × ₹{Number(item.price_at_purchase).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700 shrink-0">
                                                    ₹{(item.quantity * item.price_at_purchase).toLocaleString('en-IN')}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No items</p>
                                )}
                            </div>

                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}
