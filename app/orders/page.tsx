
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import OrderList from './order-list'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/auth/login?redirect=/orders')
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name, image_url))')
        .eq('user_id', user?.id)
        .neq('status', 'created')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
                    My Orders
                </h1>

                <OrderList initialOrders={orders || []} />
            </main>
        </div>
    )
}
