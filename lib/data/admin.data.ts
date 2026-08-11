// lib/data/admin.data.ts
import { unstable_cache } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Banner, Promotion } from '@/types'

// ─── Internal type definitions ────────────────────────────────────────────────

type AdminProduct = {
    id: string
    name: string
    price: number
    image_url: string | null
    stock_quantity: number
    description: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

type OrderProfile = {
    full_name: string | null
    email: string | null
}

type AdminOrder = {
    id: string
    user_id: string
    total_amount: number
    shipping_amount: number
    status: string
    created_at: string
    coupon_id: string | null
    discount_amount: number | null
    delivery_address_id: string | null
    order_items: Array<{
        id: string
        product_id: string
        quantity: number
        price_at_purchase: number
        product: { name: string; image_url: string | null } | null
    }>
    delivery_address: Record<string, unknown> | null
    profiles: OrderProfile | null
}

// ─── Admin reads (short TTL — admin needs near-real-time data) ────────────────

/**
 * All products for admin table. 60s cache, tagged 'products'.
 */
export const getAdminProducts = unstable_cache(
    async (): Promise<AdminProduct[]> => {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('products')
            .select('id, name, price, image_url, stock_quantity, description, is_active, created_at, updated_at')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getAdminProducts] error:', error)
            return []
        }
        return (data ?? []) as AdminProduct[]
    },
    ['admin-products'],
    { tags: ['products'], revalidate: 60 }
)

/**
 * All banners for admin list. 60s cache, tagged 'banners'.
 */
export const getAdminBanners = unstable_cache(
    async (): Promise<Banner[]> => {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('order_index', { ascending: true })

        if (error) {
            console.error('[getAdminBanners] error:', error)
            return []
        }
        return (data ?? []) as Banner[]
    },
    ['admin-banners'],
    { tags: ['banners'], revalidate: 60 }
)

/**
 * All promotions for admin list. 60s cache, tagged 'promotions'.
 */
export const getAdminPromotions = unstable_cache(
    async (): Promise<Promotion[]> => {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getAdminPromotions] error:', error)
            return []
        }
        return (data ?? []) as Promotion[]
    },
    ['admin-promotions'],
    { tags: ['promotions'], revalidate: 60 }
)

/**
 * All orders enriched with customer profile data.
 * Fixes N+1: previously fetched profiles in a separate sequential query.
 * Now uses a single batched IN() query. 30s cache — orders need fresher data.
 * Tagged 'orders'.
 */
export const getAdminOrders = unstable_cache(
    async (): Promise<AdminOrder[]> => {
        const supabase = createAdminClient()

        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select(`
        id,
        user_id,
        total_amount,
        shipping_amount,
        status,
        created_at,
        coupon_id,
        discount_amount,
        delivery_address_id,
        shipping_address,
        order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          product:products ( name, image_url )
        ),
        delivery_address:addresses (*)
      `)
            .order('created_at', { ascending: false })

        if (ordersError) {
            console.error('[getAdminOrders] orders error:', ordersError)
            return []
        }

        if (!orders || orders.length === 0) return []

        // Batch profile fetch — single query, no N+1
        const userIds = [...new Set(orders.map((o) => o.user_id as string))]

        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)

        if (profilesError) {
            console.error('[getAdminOrders] profiles error:', profilesError)
        }

        const profileMap = new Map<string, OrderProfile>(
            (profiles ?? []).map((p) => [
                p.id as string,
                { full_name: p.full_name as string | null, email: p.email as string | null },
            ])
        )

        return orders.map((order) => ({
            ...(order as unknown as Omit<AdminOrder, 'profiles'>),
            profiles: profileMap.get(order.user_id as string) ?? null,
        })) as AdminOrder[]
    },
    ['admin-orders'],
    { tags: ['orders'], revalidate: 30 }
)
