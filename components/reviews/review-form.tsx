'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StarRating } from './star-rating'
import { insertReviewSchema, updateReviewSchema } from '@/lib/validations/reviews'
import { createReview, updateReview } from '@/lib/actions/reviews'
import { ReviewWithUserAndReply } from '@/types'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ReviewFormProps {
    productId: string
    existingReview?: ReviewWithUserAndReply
    onSuccess?: () => void
    onCancel?: () => void
}

type ReviewFormValues = {
    rating: number
    comment?: string
}

export function ReviewForm({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!existingReview

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(isEditing ? updateReviewSchema.omit({ reviewId: true }) : insertReviewSchema.omit({ productId: true })),
        defaultValues: {
            rating: existingReview?.rating || 0,
            comment: existingReview?.comment || '',
        },
    })

    const rating = watch('rating')

    const onSubmit = async (data: ReviewFormValues) => {
        setIsSubmitting(true)
        const formData = new FormData()

        if (isEditing) {
            formData.append('reviewId', existingReview.id)
            formData.append('productId', productId) // Needed for revalidation
        } else {
            formData.append('productId', productId)
        }

        formData.append('rating', data.rating.toString())
        if (data.comment) {
            formData.append('comment', data.comment)
        }

        try {
            const result = isEditing
                ? await updateReview(null, formData)
                : await createReview(null, formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(isEditing ? 'Review updated!' : 'Review submitted!')
                onSuccess?.()
            }
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                {isEditing ? 'Edit your review' : 'Write a review'}
            </h3>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <StarRating
                    rating={rating}
                    onRatingChange={(val) => setValue('rating', val, { shouldValidate: true })}
                />
                {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Review
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Share your thoughts..."
                    {...register('comment')}
                />
                {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
            </div>

            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Review' : 'Submit Review'}
                </button>
            </div>
        </form>
    )
}
