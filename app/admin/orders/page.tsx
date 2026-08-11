// app/admin/orders/page.tsx
import { createAdminClient } from '@/lib/supabase/admin'
import OrderRow from './order-row'
import { OrderFilters } from './filters'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const search = searchParams?.search as string | undefined
    const statusParam = searchParams?.status
    const statusArray = statusParam ? (Array.isArray(statusParam) ? statusParam : [statusParam]) : []
    const needsAttention = searchParams?.needs_attention === 'true'

    const supabaseAdmin = createAdminClient()

    let query = supabaseAdmin
        .from('orders')
        .select(`
            id,
            user_id,
            total_amount,
            status,
            created_at,
            razorpay_order_id,
            discount_amount,
            order_items (
                id,
                product_id,
                quantity,
                price_at_purchase,
                product:products ( name, image_url, price )
            ),
            shipping_address,
            delivery_address:addresses (*)
        `)
        .order('created_at', { ascending: false })
        .limit(100) // simplified pagination for now

    if (statusArray.length > 0) {
        query = query.in('status', statusArray)
    }

    let needsAttentionIds: string[] | null = null

    if (needsAttention) {
        const { data: attentionIds } = await supabaseAdmin.rpc('get_needs_attention_order_ids')
        if (attentionIds) {
            needsAttentionIds = attentionIds.map((item: any) => item.get_needs_attention_order_ids || item)
            if (needsAttentionIds && needsAttentionIds.length > 0) {
                query = query.in('id', needsAttentionIds)
            } else {
                query = query.in('id', ['00000000-0000-0000-0000-000000000000'])
            }
        }
    }

    const { data: rawOrders, error } = await query

    if (error) {
        console.error('Error fetching admin orders:', JSON.stringify(error, null, 2))
    }

    // Fetch profiles manually to avoid PostgREST relationship errors
    const userIds = [...new Set((rawOrders || []).map(o => o.user_id))]
    let profileMap = new Map<string, any>()
    
    if (userIds.length > 0) {
        const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)
            
        if (profiles) {
            profileMap = new Map(profiles.map(p => [p.id, p]))
        }
    }

    const orders = (rawOrders || []).map(order => ({
        ...order,
        profiles: profileMap.get(order.user_id) || null
    }))

    let filteredOrders = orders
    if (search) {
        const lowerSearch = search.toLowerCase()
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(lowerSearch) ||
            order.razorpay_order_id?.toLowerCase().includes(lowerSearch) ||
            order.profiles?.full_name?.toLowerCase().includes(lowerSearch) ||
            order.profiles?.email?.toLowerCase().includes(lowerSearch)
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
            <div className="sm:flex sm:items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders Management</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        View, manage, and track all customer orders across the platform.
                    </p>
                </div>
            </div>

            <OrderFilters />

            <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-slate-200 sm:rounded-xl">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider sm:pl-6">
                                            Order Info
                                        </th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                                                No orders found matching criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <OrderRow 
                                                key={order.id} 
                                                order={order} 
                                                isNeedsAttention={needsAttentionIds?.includes(order.id) || false} 
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
