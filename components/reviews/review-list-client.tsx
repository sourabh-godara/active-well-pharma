// components/reviews/review-list-client.tsx
'use client'

import { useUser } from '@/app/context/user-context'
import { ReviewList } from '@/components/reviews/review-list'
import type { ReviewWithUserAndReply } from '@/types'

interface ReviewListClientProps {
    productId: string
    initialReviews: ReviewWithUserAndReply[]
}

export function ReviewListClient({ productId, initialReviews }: ReviewListClientProps) {
    const { user, isAdmin } = useUser()

    return (
        <ReviewList
            productId={productId}
            initialReviews={initialReviews}
            currentUserId={user?.id}
            isAdmin={isAdmin}
        />
    )
}
