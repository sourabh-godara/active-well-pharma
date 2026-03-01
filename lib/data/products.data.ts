// lib/data/products.data.ts
import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Product, ProductImage, ProductBenefit, ProductWithGallery } from '@/types'

// ─── Internal helpers ────────────────────────────────────────────────────────

function createPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

type ProductRow = Omit<Product, 'gallery' | 'images' | 'benefits'>

type ProductWithRating = ProductRow & {
    average_rating: number
    total_reviews: number
}

// ─── Public cached reads ─────────────────────────────────────────────────────

/**
 * Lightweight product list for listing pages.
 * Cached across requests for 5 minutes, tagged 'products'.
 */
export const getProducts = unstable_cache(
    async (): Promise<ProductRow[]> => {
        const supabase = createPublicClient()
        const { data, error } = await supabase
            .from('products')
            .select('id, name, price, image_url, stock_quantity, description, is_active, created_at, updated_at')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getProducts] error:', error)
            return []
        }
        return data ?? []
    },
    ['products-list'],
    { tags: ['products'], revalidate: 300 }
)

/**
 * Full product list with aggregated ratings.
 * Used on homepage and related products sections.
 * Cached across requests for 5 minutes, tagged 'products' + 'reviews'.
 */
export const getProductsWithRating = unstable_cache(
    async (): Promise<ProductWithRating[]> => {
        const supabase = createPublicClient()

        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (productsError) {
            console.error('[getProductsWithRating] products error:', productsError)
            return []
        }
        if (!products || products.length === 0) return []

        const productIds = products.map((p) => p.id as string)

        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('product_id, rating')
            .in('product_id', productIds)

        if (reviewsError) {
            console.error('[getProductsWithRating] reviews error:', reviewsError)
            return products.map((p) => ({ ...p, average_rating: 0, total_reviews: 0 }))
        }

        // Aggregate ratings in memory — avoids a separate DB aggregation call
        const ratingMap = new Map<string, { count: number; sum: number }>(
            products.map((p) => [p.id as string, { count: 0, sum: 0 }])
        )

        for (const r of reviews ?? []) {
            const entry = ratingMap.get(r.product_id as string)
            if (entry) {
                entry.count++
                entry.sum += r.rating as number
            }
        }

        return products.map((p) => {
            const stats = ratingMap.get(p.id as string) ?? { count: 0, sum: 0 }
            return {
                ...p,
                average_rating: stats.count > 0 ? Number((stats.sum / stats.count).toFixed(1)) : 0,
                total_reviews: stats.count,
            }
        })
    },
    ['products-with-rating'],
    { tags: ['products', 'reviews'], revalidate: 300 }
)

/**
 * Per-product detail with gallery images and benefits.
 * Parallelized fetches. Cached per product ID for 5 minutes.
 * Tagged 'products' + `product-{id}` for surgical invalidation.
 */
export function getProductWithGallery(id: string): Promise<ProductWithGallery | null> {
    return unstable_cache(
        async (): Promise<ProductWithGallery | null> => {
            const supabase = createPublicClient()
            const adminSupabase = createAdminClient()

            // Parallel fetch — eliminates sequential waterfall
            const [
                { data: product, error: productError },
                { data: images, error: imagesError },
                { data: benefits, error: benefitsError },
            ] = await Promise.all([
                supabase.from('products').select('*').eq('id', id).single(),
                supabase
                    .from('product_images')
                    .select('*')
                    .eq('product_id', id)
                    .order('order_index', { ascending: true }),
                adminSupabase
                    .from('product_benefits')
                    .select('*')
                    .eq('product_id', id)
                    .order('order_index', { ascending: true }),
            ])

            if (productError || product === null) {
                console.error('[getProductWithGallery] product error:', id, productError)
                return null
            }

            if (imagesError) console.error('[getProductWithGallery] images error:', imagesError)
            if (benefitsError) console.error('[getProductWithGallery] benefits error:', benefitsError)

            const gallery: string[] = []
            if (product.image_url !== null) gallery.push(product.image_url as string)
            for (const img of images ?? []) {
                gallery.push(img.image_url as string)
            }

            return {
                ...product,
                gallery,
                images: (images ?? []) as ProductImage[],
                benefits: (benefits ?? []) as ProductBenefit[],
            }
        },
        [`product-gallery-${id}`],
        { tags: [`product-${id}`, 'products'], revalidate: 300 }
    )()
}
