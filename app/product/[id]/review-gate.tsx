// app/product/[id]/review-gate.tsx
'use client'

import { useUser } from '@/app/context/user-context'
import { ReviewForm } from '@/components/reviews/review-form'

interface ReviewGateProps {
    productId: string
}

export function ReviewGate({ productId }: ReviewGateProps) {
    const { user, isAdmin, isBlocked, loading } = useUser()

    // Skeleton while auth state resolves — prevents layout shift
    if (loading) {
        return <div className="h-28 w-full rounded-xl bg-muted animate-pulse" />
    }

    if (!user) {
        return (
            <div className="rounded-xl bg-muted p-4 text-sm font-body text-muted-foreground">
                Please{' '}
                <a href="/auth/login" className="font-medium text-primary hover:underline">
                    sign in
                </a>{' '}
                to write a review.
            </div>
        )
    }

    if (isAdmin) {
        return (
            <div className="rounded-xl bg-yellow-50 p-4 text-sm font-body text-yellow-700">
                Admins cannot write reviews, but can reply to them.
            </div>
        )
    }

    if (isBlocked) {
        return (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-body text-red-700">
                Your account is temporarily restricted from posting reviews.
            </div>
        )
    }

    // ReviewForm server action handles "already reviewed" — returns error toast
    return <ReviewForm productId={productId} />
}
