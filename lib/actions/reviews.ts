'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache'
import { insertReviewSchema, updateReviewSchema, insertReplySchema } from '@/lib/validations/reviews'
import { ReviewWithUserAndReply, ProductRatingSummary } from '@/types'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

async function getSupabase() {
    const cookieStore = await cookies()
    return createClient(cookieStore)
}

export async function createReview(prevState: any, formData: FormData) {
    const supabase = await getSupabase()

    const data = {
        productId: formData.get('productId'),
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    }

    const result = insertReviewSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Invalid input data' }
    }

    const { productId, rating, comment } = result.data

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to review.' }
    }

    // Check if user is blocked or admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_blocked')
        .eq('id', user.id)
        .single()

    if (profile?.is_blocked) {
        return { error: 'Your account is blocked.' }
    }

    if (profile?.role === 'admin') {
        return { error: 'Admins cannot submit reviews.' }
    }

    // Check if review already exists (double check despite DB constraint for cleaner error)
    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        return { error: 'You have already reviewed this product.' }
    }

    const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
    })

    if (error) {
        if (error.code === '23505') {
            return { error: 'You have already reviewed this product.' }
        }
        return { error: 'Failed to submit review' }
    }

    revalidateTag(`reviews-${productId}`)
    revalidateTag(`rating-${productId}`)
    revalidatePath(`/product/${productId}`)
    return { success: true }
}

export async function updateReview(prevState: any, formData: FormData) {
    const supabase = await getSupabase()

    const data = {
        reviewId: formData.get('reviewId'),
        rating: formData.get('rating'),
        comment: formData.get('comment'),
    }

    const result = updateReviewSchema.safeParse(data)
    if (!result.success) return { error: 'Invalid data' }

    const { reviewId, rating, comment } = result.data

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check blocked
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_blocked')
        .eq('id', user.id)
        .single()

    if (profile?.is_blocked) return { error: 'Account blocked' }

    const { error } = await supabase
        .from('reviews')
        .update({ rating, comment, updated_at: new Date().toISOString() }) // updated_at trigger should handle this, but explicit is fine too needed? Trigger is simpler.
        // Schema has trigger, so no need to send updated_at manually, but fine.
        .eq('id', reviewId)
        .eq('user_id', user.id)

    if (error) return { error: 'Update failed' }

    const productId = formData.get('productId') as string
    if (productId) {
        revalidateTag(`reviews-${productId}`)
        revalidateTag(`rating-${productId}`)
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

    // Revalidate everything
    revalidateTag(`reviews-${productId}`)
    revalidateTag(`rating-${productId}`)
    revalidatePath(`/product/${productId}`)
    return { success: true }
}

export async function createReviewReply(prevState: any, formData: FormData) {
    const supabase = await getSupabase()

    const data = {
        reviewId: formData.get('reviewId'),
        replyText: formData.get('replyText'),
    }

    const result = insertReplySchema.safeParse(data)
    if (!result.success) return { error: 'Invalid input' }

    const { reviewId, replyText } = result.data

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Admin only' }

    const { error } = await supabase.from('review_replies').upsert({
        review_id: reviewId,
        admin_id: user.id,
        reply_text: replyText,
        updated_at: new Date().toISOString()
    }, { onConflict: 'review_id' })

    if (error) {
        console.error('Error creating reply:', error)
        return { error: 'Reply failed: ' + error.message }
    }

    const productId = formData.get('productId') as string
    if (productId) {
        revalidateTag(`reviews-${productId}`)
        revalidatePath(`/product/${productId}`)
    }

    return { success: true }
}


export async function getProductReviews(productId: string, page = 1, limit = 10) {
    // For public fetch, we might want to use a cached function or just standard fetch
    // But since this is a server action/function called from RSC, we can use createClient with cookies?
    // Actually for public view, maybe we don't need auth?
    // But RLS says "viewable by everyone".
    // "ReviewWithUserAndReply" requires joining.
    const supabase = await getSupabase()
    const offset = (page - 1) * limit

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
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching reviews:', error)
        return [] as ReviewWithUserAndReply[]
    }

    // transform data to match type
    const reviews: ReviewWithUserAndReply[] = (data || []).map((review: any) => {
        const replyData = Array.isArray(review.reply) ? review.reply[0] : review.reply

        return {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user: review.user,
            reply: replyData ? {
                reply_text: replyData.reply_text,
                created_at: replyData.created_at,
                admin: replyData.admin
            } : null
        }
    })

    return reviews
}

// Cached version for product rating summary
export const getCachedProductRating = async (productId: string) => {
    const fn = unstable_cache(
        async () => {
            // Use a fresh client without cookies for public data to avoid "cookies() inside cache" error
            const supabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { data, count, error } = await supabase
                .from('reviews')
                .select('rating', { count: 'exact' })
                .eq('product_id', productId)

            if (error) return { product_id: productId, average_rating: 0, total_reviews: 0 }

            // Calculate local average if not using DB aggregation
            const total = count || 0
            if (total === 0) return { product_id: productId, average_rating: 0, total_reviews: 0 }

            const sum = data?.reduce((acc, r) => acc + r.rating, 0) || 0
            const avg = sum / total
            return { product_id: productId, average_rating: Number(avg.toFixed(1)), total_reviews: total }
        },
        [`rating-${productId}`],
        { tags: [`rating-${productId}`], revalidate: 60 }
    )
    return fn()
}
