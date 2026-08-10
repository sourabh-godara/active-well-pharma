import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DollarSign, Package, ShoppingCart, Clock } from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import { PerformanceChart } from '@/components/admin/performance-chart'
import { StatusSummary } from '@/components/admin/status-summary'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const [
        { count: productsCount },
        { count: ordersCount },
        { data: revenueData },
        { data: shippedOrders },
        { data: recentOrders },
        { data: allOrders }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['paid', 'confirmed', 'shipped', 'delivered']),
        supabase.from('orders').select('total_amount').in('status', ['paid', 'confirmed', 'shipped', 'delivered']),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'shipped'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('created_at, total_amount').in('status', ['paid', 'confirmed', 'shipped', 'delivered']).order('created_at', { ascending: true })
    ])

    const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total_amount, 0) || 0

    const chartDataMap = new Map<string, number>()
    allOrders?.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        chartDataMap.set(date, (chartDataMap.get(date) || 0) + order.total_amount)
    })
    const chartData = Array.from(chartDataMap.entries())
        .map(([name, value]) => ({ name, value }))
        .slice(-7)

    // Badge variant helper
    const statusBadge = (status: string) => {
        switch (status) {
            case 'delivered': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">Delivered</Badge>
            case 'confirmed': return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 text-xs">Confirmed</Badge>
            case 'paid': return <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 text-xs">Paid</Badge>
            case 'shipped': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">Shipped</Badge>
            case 'cancelled': return <Badge variant="destructive" className="text-xs">Cancelled</Badge>
            case 'failed': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 text-xs">Failed</Badge>
            case 'created': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs">Abandoned</Badge>
            default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">Pending</Badge>
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page title */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground text-sm">Store overview and recent activity.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    description="All non-cancelled orders"
                />
                <StatsCard
                    title="Total Orders"
                    value={ordersCount ?? 0}
                    icon={ShoppingCart}
                    description="Lifetime orders placed"
                />
                <StatsCard
                    title="Total Products"
                    value={productsCount ?? 0}
                    icon={Package}
                    description="Active catalogue items"
                />
                <StatsCard
                    title="Shipped Orders"
                    value={shippedOrders?.length ?? 0}
                    icon={Package}
                    description="In transit"
                />
            </div>

            {/* Chart + Status Summary */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <PerformanceChart data={chartData} />
                </div>
                <div>
                    <StatusSummary
                        shippedCount={shippedOrders?.length ?? 0}
                        totalCount={ordersCount ?? 0}
                    />
                </div>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
                    <p className="text-xs text-muted-foreground">Last 5 orders placed in the store</p>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Order ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!recentOrders || recentOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                                            No transactions yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentOrders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell className="font-medium text-sm">
                                                ₹{order.total_amount?.toFixed(2) ?? '—'}
                                            </TableCell>
                                            <TableCell>{statusBadge(order.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
