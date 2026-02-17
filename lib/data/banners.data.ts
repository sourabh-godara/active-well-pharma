
import { cache } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const createPublicClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

export const getBanners = cache(async () => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching banners:', error)
        return []
    }
    return data
})
