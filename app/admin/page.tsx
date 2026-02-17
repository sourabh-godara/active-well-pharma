
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import { PerformanceChart } from '@/components/admin/performance-chart'
import { StatusSummary } from '@/components/admin/status-summary'
import OrderRow from './orders/order-row'

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch metrics data
    const [
        { count: productsCount },
        { count: ordersCount },
        { data: revenueData },
        { data: pendingOrders },
        { data: recentOrders },
        { data: allOrders } // Fetch all orders for chart
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').neq('status', 'cancelled'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('created_at, total_amount').neq('status', 'cancelled').order('created_at', { ascending: true })
    ])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // Process Chart Data (Group by date)
    const chartDataMap = new Map<string, number>();
    allOrders?.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        chartDataMap.set(date, (chartDataMap.get(date) || 0) + order.total_amount);
    });

    // Convert map to array and take last 7 days or points
    const chartData = Array.from(chartDataMap.entries()).map(([name, value]) => ({ name, value })).slice(-7);

    return (
        <div className="space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}

                />
                <StatsCard
                    title="Total Orders"
                    value={ordersCount || 0}
                    icon={ShoppingCart}

                />
                <StatsCard
                    title="Total Products"
                    value={productsCount || 0}
                    icon={Package}

                />
                <StatsCard
                    title="Pending Orders"
                    value={pendingOrders?.length || 0}
                    icon={Users}

                />
            </div>

            {/* Middle Row: Chart & Status Summary */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <PerformanceChart data={chartData} />
                </div>
                <div>
                    <StatusSummary pendingCount={pendingOrders?.length || 0} totalCount={ordersCount || 0} />
                </div>
            </div>

            {/* Bottom Row: Recent Orders (Todo List Style) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-3 rounded-lg bg-white p-6 shadow">
                    <h3 className="mb-4 text-base font-semibold leading-6 text-gray-900">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Order ID</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders?.map((order) => (
                                    <OrderRow key={order.id} order={order} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
