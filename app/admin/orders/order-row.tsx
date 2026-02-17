'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function OrderRow({ order }: { order: any }) {
    const [status, setStatus] = useState(order.status)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setLoading(true)

        try {
            await updateOrderStatus(order.id, newStatus)
            toast.success('Order status updated')
            router.refresh()
        } catch (error) {
            toast.error('Failed to update status')
            setStatus(order.status) // revert
        } finally {
            setLoading(false)
        }
    }

    return (
        <tr>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{order.id.slice(0, 8)}...</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.profiles?.full_name || 'Unknown'}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${order.total_amount}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs sm:leading-6"
                >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                {/* Details link could go here */}
            </td>
        </tr>
    )
}
