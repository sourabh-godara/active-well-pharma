// lib/data/reviews.data.ts
// Pure read layer — no 'use server' directive.
// Do NOT add mutations here. Mutations stay in lib/actions/reviews.ts.

import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import type { ReviewWithUserAndReply, ProductRatingSummary } from '@/types'

// ─── Internal helpers ─────────────────────────────────────────────────────────

function createPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

type RawReviewRow = {
    id: string
    rating: number
    comment: string | null
    created_at: string
    user: { id: string; full_name: string | null } | null
    reply: Array<{
        reply_text: string
        created_at: string
        admin: { id: string; full_name: string | null } | null
    }> | null
}

// ─── Cached reads ─────────────────────────────────────────────────────────────

/**
 * Paginated product reviews.
 * Cached per (productId, page) pair for 2 minutes.
 * Tagged `reviews-{productId}` for surgical invalidation after mutations.
 */
export function getProductReviews(
    productId: string,
    page = 1,
    limit = 10
): Promise<ReviewWithUserAndReply[]> {
    return unstable_cache(
        async (): Promise<ReviewWithUserAndReply[]> => {
            const supabase = createPublicClient()
            const offset = (page - 1) * limit

            const { data, error } = await supabase
                .from('reviews')
                .select(`
          id,
          rating,
          comment,
          created_at,
          user:profiles!reviews_user_id_fkey ( id, full_name ),
          reply:review_replies (
            reply_text,
            created_at,
            admin:profiles!review_replies_admin_id_fkey ( id, full_name )
          )
        `)
                .eq('product_id', productId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) {
                console.error('[getProductReviews] error:', productId, error)
                return []
            }

            return ((data ?? []) as unknown as RawReviewRow[]).map((review) => {
                const replyRaw = Array.isArray(review.reply) ? review.reply[0] : review.reply
                return {
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    created_at: review.created_at,
                    user: review.user,
                    reply: replyRaw
                        ? {
                            reply_text: replyRaw.reply_text,
                            created_at: replyRaw.created_at,
                            admin: replyRaw.admin,
                        }
                        : null,
                }
            })
        },
        [`reviews-${productId}-page-${page}`],
        { tags: [`reviews-${productId}`, 'reviews'], revalidate: 120 }
    )()
}

/**
 * Aggregated rating summary for a product.
 * Cached per productId for 2 minutes.
 * Tagged `rating-{productId}` for surgical invalidation.
 */
export function getCachedProductRating(productId: string): Promise<ProductRatingSummary> {
    return unstable_cache(
        async (): Promise<ProductRatingSummary> => {
            const supabase = createPublicClient()

            const { data, count, error } = await supabase
                .from('reviews')
                .select('rating', { count: 'exact' })
                .eq('product_id', productId)

            if (error) {
                console.error('[getCachedProductRating] error:', productId, error)
                return { product_id: productId, average_rating: 0, total_reviews: 0 }
            }

            const total = count ?? 0
            if (total === 0) {
                return { product_id: productId, average_rating: 0, total_reviews: 0 }
            }

            const sum = (data ?? []).reduce((acc, r) => acc + (r.rating as number), 0)
            return {
                product_id: productId,
                average_rating: Number((sum / total).toFixed(1)),
                total_reviews: total,
            }
        },
        [`rating-${productId}`],
        { tags: [`rating-${productId}`], revalidate: 120 }
    )()
}
