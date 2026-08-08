import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabaseAdmin = createAdminClient()
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'admin') {
        return new NextResponse('Forbidden', { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const statusParams = searchParams.getAll('status')
    const needsAttention = searchParams.get('needs_attention') === 'true'

    let query = supabaseAdmin
        .from('orders')
        .select(`
            id,
            user_id,
            total_amount,
            status,
            created_at,
            razorpay_order_id
        `)
        .order('created_at', { ascending: false })
        .limit(10000)

    if (statusParams.length > 0) {
        query = query.in('status', statusParams)
    }

    if (needsAttention) {
        const { data: attentionIds } = await supabaseAdmin.rpc('get_needs_attention_order_ids')
        // Supabase RPC returns an array of objects or values depending on how it's defined.
        // For SETOF uuid, it usually returns an array of objects like { get_needs_attention_order_ids: 'uuid' }
        if (attentionIds) {
            const ids = attentionIds.map((item: any) => item.get_needs_attention_order_ids || item)
            if (ids.length > 0) {
                query = query.in('id', ids)
            } else {
                query = query.in('id', ['00000000-0000-0000-0000-000000000000']) // Ensure no results
            }
        }
    }

    const { data: rawOrders, error } = await query

    if (error) {
        return new NextResponse(error.message, { status: 500 })
    }

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

    // Client-side search logic duplicated here for the export (if any)
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

    // Generate CSV
    const headers = ['Order ID', 'Razorpay Order ID', 'Date', 'Customer Name', 'Customer Email', 'Amount', 'Status']
    const rows = filteredOrders.map(order => [
        order.id,
        order.razorpay_order_id || '',
        new Date(order.created_at).toISOString(),
        `"${((order.profiles as any)?.full_name || '').replace(/"/g, '""')}"`,
        `"${((order.profiles as any)?.email || '').replace(/"/g, '""')}"`,
        order.total_amount,
        order.status
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="orders_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
    })
}
