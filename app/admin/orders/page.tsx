
import { createAdminClient } from '@/lib/supabase/admin'
import OrderRow from './order-row'

export default async function AdminOrdersPage() {
    const supabase = createAdminClient()

    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name, image_url)), delivery_address:addresses(*)')
        .order('created_at', { ascending: false })

    if (ordersError) {
        console.error('[Admin Orders] Failed to fetch orders:', ordersError)
    }

    // Fetch profiles for all order user_ids
    const userIds = [...new Set((orders ?? []).map((o: any) => o.user_id))]
    const profileMap: Record<string, { full_name: string | null; email: string | null }> = {}

    if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)

        if (profilesError) {
            console.error('[Admin Orders] Failed to fetch profiles:', profilesError)
        }

        for (const p of profiles ?? []) {
            profileMap[p.id] = { full_name: p.full_name, email: p.email }
        }
    }

    // Attach profile data to each order
    const enrichedOrders = (orders ?? []).map((order: any) => ({
        ...order,
        profiles: profileMap[order.user_id] ?? null,
    }))

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Orders</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all orders including status and customer details.
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Order ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {enrichedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                                            No orders yet.
                                        </td>
                                    </tr>
                                ) : (
                                    enrichedOrders.map((order: any) => (
                                        <OrderRow key={order.id} order={order} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
