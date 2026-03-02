// components/reviews/review-list.tsx
'use client'

import { useState } from 'react'
import type { ReviewWithUserAndReply } from '@/types'
import { ReviewItem } from './review-item'
import { ReviewForm } from './review-form'
import { createReviewReply, deleteReview, getProductReviews } from '@/lib/actions/reviews'
import { useUser } from '@/app/context/user-context'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ReviewListProps {
    productId: string
    initialReviews: ReviewWithUserAndReply[]
    // Optional: server can pass these when available; otherwise resolved from useUser()
    currentUserId?: string
    isAdmin?: boolean
}

export function ReviewList({
    productId,
    initialReviews,
    currentUserId: currentUserIdProp,
    isAdmin: isAdminProp,
}: ReviewListProps) {
    // Auth from client context — no server cookie read required
    const { user, isAdmin: contextIsAdmin } = useUser()
    const currentUserId = currentUserIdProp ?? user?.id
    const isAdmin = isAdminProp ?? contextIsAdmin

    const [reviews, setReviews] = useState<ReviewWithUserAndReply[]>(initialReviews)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialReviews.length === 10)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [editingReview, setEditingReview] = useState<ReviewWithUserAndReply | null>(null)
    const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(null)

    const loadMore = async () => {
        setIsLoadingMore(true)
        const nextPage = page + 1
        const newReviews = await getProductReviews(productId, nextPage)
        if (newReviews.length < 10) setHasMore(false)
        setReviews(prev => [...prev, ...newReviews])
        setPage(nextPage)
        setIsLoadingMore(false)
    }

    const handleEdit = (review: ReviewWithUserAndReply) => {
        setEditingReview(review)
    }

    const handleUpdateSuccess = async () => {
        setEditingReview(null)
        const fresh = await getProductReviews(productId, 1, Math.max(10, reviews.length))
        setReviews(fresh)
    }

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure?')) return
        const result = await deleteReview(reviewId, productId)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Review deleted')
            setReviews(prev => prev.filter(r => r.id !== reviewId))
        }
    }

    const handleReplySubmit = async (reviewId: string, text: string) => {
        const formData = new FormData()
        formData.append('reviewId', reviewId)
        formData.append('replyText', text)
        formData.append('productId', productId)
        const result = await createReviewReply(null, formData)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Reply added')
            setReplyingToReviewId(null)
            const fresh = await getProductReviews(productId, 1, Math.max(10, reviews.length))
            setReviews(fresh)
        }
    }

    return (
        <div className="mt-8 space-y-8">
            {editingReview && (
                <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
                    <div className="mb-2 flex justify-between">
                        <h3 className="font-semibold text-indigo-900">Editing Review</h3>
                        <button onClick={() => setEditingReview(null)} className="text-sm text-gray-500">Cancel</button>
                    </div>
                    <ReviewForm
                        productId={productId}
                        existingReview={editingReview}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setEditingReview(null)}
                    />
                </div>
            )}

            <div className="divide-y divide-gray-200">
                {reviews.map(review => (
                    <div key={review.id}>
                        <ReviewItem
                            review={review}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReply={(id) => setReplyingToReviewId(id)}
                        />

                        {replyingToReviewId === review.id && (
                            <div className="ml-8 mt-4 rounded-md bg-gray-50 p-4">
                                <h4 className="mb-2 text-sm font-medium text-gray-900">Reply as Admin</h4>
                                <form action={async (formData) => {
                                    const text = formData.get('replyText') as string
                                    if (!text) {
                                        toast.error('Reply cannot be empty')
                                        return
                                    }
                                    await handleReplySubmit(review.id, text)
                                }}>
                                    <textarea
                                        name="replyText"
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                        rows={3}
                                        placeholder="Write your reply..."
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                                        >
                                            Submit Reply
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReplyingToReviewId(null)}
                                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-8">
                    No reviews yet. Be the first to review this product!
                </p>
            )}

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoadingMore ? 'Loading...' : 'Load more reviews'}
                    </button>
                </div>
            )}
        </div>
    )
}
