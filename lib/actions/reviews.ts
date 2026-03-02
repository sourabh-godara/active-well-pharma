// lib/actions/reviews.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache'
import { insertReviewSchema, updateReviewSchema, insertReplySchema } from '@/lib/validations/reviews'
import type { ReviewWithUserAndReply, ProductRatingSummary } from '@/types'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Used ONLY by mutation actions that require an authenticated user
async function getSupabase() {
    const cookieStore = await cookies()
    return createClient(cookieStore)
}

// ─── Public read — no cookies, no auth ───────────────────────────────────────

export async function getProductReviews(
    productId: string,
    page = 1,
    limit = 10,
): Promise<ReviewWithUserAndReply[]> {
    const fn = unstable_cache(
        async (p: number, l: number): Promise<ReviewWithUserAndReply[]> => {
            // Public anon client — no cookies() → page.tsx stays Static
            const supabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            )
            const offset = (p - 1) * l

            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id, rating, comment, created_at, updated_at,
                    user:profiles!reviews_user_id_fkey(id, full_name),
                    reply:review_replies(
                        reply_text,
                        created_at,
                        admin:profiles!review_replies_admin_id_fkey(id, full_name)
                    )
                `)
                .eq('product_id', productId)
                .order('created_at', { ascending: false })
                .range(offset, offset + l - 1)

            if (error) {
                console.error('Error fetching reviews:', error)
                return []
            }

            return (data ?? []).map((review) => {
                const replyData = Array.isArray(review.reply)
                    ? review.reply[0]
                    : review.reply

                const userData = Array.isArray(review.user)
                    ? review.user[0]
                    : review.user

                return {
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    created_at: review.created_at,
                    user: userData as { id: string; full_name: string | null } | null,
                    reply: replyData
                        ? {
                            reply_text: replyData.reply_text,
                            created_at: replyData.created_at,
                            admin: (Array.isArray(replyData.admin)
                                ? replyData.admin[0]
                                : replyData.admin) as { id: string; full_name: string | null } | null,
                        }
                        : null,
                } satisfies ReviewWithUserAndReply
            })
        },
        [`reviews-${productId}-${page}-${limit}`],
        { tags: [`reviews-${productId}`], revalidate: 60 },
    )

    return fn(page, limit)
}

// ─── Cached product rating summary — already correct, unchanged ───────────────

export const getCachedProductRating = async (productId: string): Promise<ProductRatingSummary> => {
    const fn = unstable_cache(
        async (): Promise<ProductRatingSummary> => {
            const supabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            )

            const { data, count, error } = await supabase
                .from('reviews')
                .select('rating', { count: 'exact' })
                .eq('product_id', productId)

            if (error) return { product_id: productId, average_rating: 0, total_reviews: 0 }

            const total = count ?? 0
            if (total === 0) return { product_id: productId, average_rating: 0, total_reviews: 0 }

            const sum = data?.reduce((acc, r) => acc + r.rating, 0) ?? 0
            return {
                product_id: productId,
                average_rating: Number((sum / total).toFixed(1)),
                total_reviews: total,
            }
        },
        [`rating-${productId}`],
        { tags: [`rating-${productId}`], revalidate: 60 },
    )
    return fn()
}

// ─── Mutations — keep getSupabase() / cookies() ───────────────────────────────

export async function createReview(prevState: unknown, formData: FormData) {
    const supabase = await getSupabase()

    const result = insertReviewSchema.safeParse({
        productId: formData.get('productId'),
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    })
    if (!result.success) return { error: 'Invalid input data' }

    const { productId, rating, comment } = result.data
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'You must be logged in to review.' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_blocked')
        .eq('id', user.id)
        .single()

    if (profile?.is_blocked) return { error: 'Your account is blocked.' }
    if (profile?.role === 'admin') return { error: 'Admins cannot submit reviews.' }

    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) return { error: 'You have already reviewed this product.' }

    const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
    })

    if (error) {
        if (error.code === '23505') return { error: 'You have already reviewed this product.' }
        return { error: error.message }
    }

    revalidateTag(`reviews-${productId}`, 'default')
    revalidateTag(`rating-${productId}`, 'default')
    revalidatePath(`/product/${productId}`)
    return { success: true }
}

export async function updateReview(prevState: unknown, formData: FormData) {
    const supabase = await getSupabase()

    const result = updateReviewSchema.safeParse({
        reviewId: formData.get('reviewId'),
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    })
    if (!result.success) return { error: 'Invalid input data' }

    const { reviewId, rating, comment } = result.data
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', reviewId)
        .eq('user_id', user.id)

    if (error) return { error: 'Update failed' }

    const productId = formData.get('productId') as string
    if (productId) {
        revalidateTag(`reviews-${productId}`, 'default')
        revalidateTag(`rating-${productId}`, 'default')
        revalidatePath(`/product/${productId}`)
    }
    return { success: true }
}

export async function deleteReview(reviewId: string, productId: string) {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id)

    if (error) return { error: 'Delete failed' }

    revalidateTag(`reviews-${productId}`, 'default')
    revalidateTag(`rating-${productId}`, 'default')
    revalidatePath(`/product/${productId}`)
    return { success: true }
}

export async function createReviewReply(prevState: unknown, formData: FormData) {
    const supabase = await getSupabase()

    const result = insertReplySchema.safeParse({
        reviewId: formData.get('reviewId'),
        replyText: formData.get('replyText'),
    })
    if (!result.success) return { error: 'Invalid input' }

    const { reviewId, replyText } = result.data
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: 'Admin only' }

    const { error } = await supabase.from('review_replies').upsert(
        {
            review_id: reviewId,
            admin_id: user.id,
            reply_text: replyText,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'review_id' },
    )

    if (error) {
        console.error('Error creating reply:', error)
        return { error: 'Reply failed: ' + error.message }
    }

    const productId = formData.get('productId') as string
    if (productId) {
        revalidateTag(`reviews-${productId}`, 'default')
        revalidatePath(`/product/${productId}`)
    }
    return { success: true }
}
