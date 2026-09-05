import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { generateInvoicePDF } from '@/lib/pdf'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

    // Fetch order details
    const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (*)
            )
        `)
        .eq('id', id)
        .single();

    if (error || !order) {
        return new NextResponse('Order not found', { status: 404 })
    }

    if (order.user_id) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', order.user_id)
            .single();
        order.profiles = profile;
    }

    try {
        const pdfBuffer = await generateInvoicePDF(order);
        
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice_${id.slice(0,8)}.pdf"`
            }
        });
    } catch (err) {
        console.error('PDF Generation Error', err);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
