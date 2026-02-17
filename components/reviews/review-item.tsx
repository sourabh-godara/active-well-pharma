'use client'

import { ReviewWithUserAndReply } from '@/types'
import { StarRating } from './star-rating'
import { formatDistanceToNow } from 'date-fns'
import { User, MessageSquare } from 'lucide-react'


interface ReviewItemProps {
    review: ReviewWithUserAndReply
    currentUserId?: string
    onEdit?: (review: ReviewWithUserAndReply) => void
    onDelete?: (reviewId: string) => void
    isAdmin?: boolean
    onReply?: (reviewId: string) => void
}

export function ReviewItem({ review, currentUserId, onEdit, onDelete, isAdmin, onReply }: ReviewItemProps) {
    const isOwner = currentUserId === review.user?.id

    return (
        <div className="border-b border-gray-200 py-6 last:border-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.user?.full_name || 'Anonymous User'}</h4>
                        <div className="flex items-center space-x-2">
                            <StarRating rating={review.rating} readOnly size="sm" />
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="flex space-x-2 text-sm">
                        <button onClick={() => onEdit?.(review)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => onDelete?.(review.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-4 text-base text-gray-600">
                <p>{review.comment}</p>
            </div>

            {review.reply && (
                <div className="mt-4 ml-8 rounded-md bg-gray-50 p-4">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-900">Response from {review.reply.admin?.full_name || 'Store'}</span>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.reply.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{review.reply.reply_text}</p>
                </div>
            )}

            {!review.reply && isAdmin && (
                <div className="mt-2">
                    <button
                        onClick={() => onReply?.(review.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        Reply to Review
                    </button>
                </div>
            )}
        </div>
    )
}
