'use client'

import { useState, useCallback } from 'react'
import { ReviewWithUserAndReply } from '@/types'
import { ReviewItem } from './review-item'
import { ReviewForm } from './review-form'
import { createReviewReply, deleteReview, getProductReviews } from '@/lib/actions/reviews'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ReviewListProps {
    productId: string
    initialReviews: ReviewWithUserAndReply[]
    currentUserId?: string
    isAdmin?: boolean
}

export function ReviewList({ productId, initialReviews, currentUserId, isAdmin }: ReviewListProps) {
    const [reviews, setReviews] = useState<ReviewWithUserAndReply[]>(initialReviews)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialReviews.length === 10)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const [editingReview, setEditingReview] = useState<ReviewWithUserAndReply | null>(null)
    const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(null)

    // Handle Load More
    const loadMore = async () => {
        setIsLoadingMore(true)
        const nextPage = page + 1
        const newReviews = await getProductReviews(productId, nextPage)

        if (newReviews.length < 10) {
            setHasMore(false)
        }

        setReviews(prev => [...prev, ...newReviews])
        setPage(nextPage)
        setIsLoadingMore(false)
    }

    // Handle Edit
    const handleEdit = (review: ReviewWithUserAndReply) => {
        setEditingReview(review)
    }

    const handleUpdateSuccess = async () => {
        setEditingReview(null)
        // Refresh list - simpler to just reload page or fetch page 1?
        // Ideally update local state, but for MVP re-fetch page 1 is safer to get updated data
        const updated = await getProductReviews(productId, 1, reviews.length) // fetch all currently shown? simple: fetch page 1
        // Actually we should just update the single item in place if we returned it, but server action returned {success:true}
        // Let's reload the page 1 to be safe OR just router.refresh() if using server components properly.
        // Since this is client component state, router.refresh() updates server components but not necessarily this state if initialized from props.
        // Let's fetch page 1.
        const fresh = await getProductReviews(productId, 1, Math.max(10, reviews.length))
        setReviews(fresh)
    }

    // Handle Delete
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

    // Handle Reply
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
            // Refresh list
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
                                        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        rows={3}
                                        placeholder="Write a reply..."
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setReplyingToReviewId(null)}
                                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                                        >
                                            Post Reply
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {reviews.length === 0 && !editingReview && (
                <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
            )}

            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
    )
}
