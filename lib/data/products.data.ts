import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Product } from '@/types'
import { createAdminClient } from '@/lib/supabase/admin'

export const createPublicClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

export const getProducts = cache(async () => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, stock_quantity, description, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }
    return data
})

export const getProductById = cache(async (id: string) => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product by id:', id, error)
        return null
    }
    return data
})

export const getProductsWithRating = async () => {
    const fn = unstable_cache(
        async () => {
            const supabase = createPublicClient()
            console.log('Fetching products with rating...')

            // 1. Fetch Products
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (productsError) {
                console.error('Error fetching products:', productsError)
                return []
            }

            if (!products || products.length === 0) return []

            // 2. Fetch Ratings (Optimization: Fetch only needed fields)
            const productIds = products.map(p => p.id)
            const { data: reviews, error: reviewsError } = await supabase
                .from('reviews')
                .select('product_id, rating')
                .in('product_id', productIds)

            if (reviewsError) {
                console.error('Error fetching reviews for aggregation:', reviewsError)
                // Return products with default 0 ratings
                return products.map(p => ({ ...p, average_rating: 0, total_reviews: 0 } as Product & { average_rating: number, total_reviews: number }))
            }

            // 3. Aggregate in Memory
            const ratingMap = new Map<string, { count: number, sum: number }>()

            // Initialize map ensures we have entries even for 0 reviews
            products.forEach(p => {
                ratingMap.set(p.id, { count: 0, sum: 0 })
            })

            reviews?.forEach(r => {
                const entry = ratingMap.get(r.product_id)
                if (entry) {
                    entry.count++
                    entry.sum += r.rating
                }
            })

            // 4. Merge
            const result = products.map(p => {
                const stats = ratingMap.get(p.id)!
                const avg = stats.count > 0 ? stats.sum / stats.count : 0
                return {
                    ...p,
                    average_rating: Number(avg.toFixed(1)),
                    total_reviews: stats.count
                }
            })

            return result
        },
        ['products-with-rating'],
        { tags: ['products'], revalidate: 60 }
    )

    return fn()
}

export const getProductWithGallery = cache(async (id: string) => {
    const supabase = createPublicClient()

    // 1. Fetch Product
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (productError || !product) {
        console.error('Error fetching product:', id, productError)
        return null
    }

    // 2. Fetch Gallery
    const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('order_index', { ascending: true })

    if (imagesError) {
        console.error('Error fetching gallery:', imagesError)
    }

    // 3. Fetch Benefits — use admin client to bypass RLS on product_benefits
    const adminSupabase = createAdminClient()
    const { data: benefits, error: benefitsError } = await adminSupabase
        .from('product_benefits')
        .select('*')
        .eq('product_id', id)
        .order('order_index', { ascending: true })

    if (benefitsError) {
        console.error('Error fetching benefits:', benefitsError)
    }

    // 4. Combine
    // Primary image is always first, then gallery images
    const gallery: string[] = []
    if (product.image_url) gallery.push(product.image_url)

    // Add additional images
    if (images && images.length > 0) {
        images.forEach(img => {
            gallery.push(img.image_url)
        })
    }

    return {
        ...product,
        gallery,
        images: images || [], // Full image objects for admin
        benefits: benefits || []
    }
})
