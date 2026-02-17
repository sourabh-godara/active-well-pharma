'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface StarRatingProps {
    rating: number
    maxRating?: number
    onRatingChange?: (rating: number) => void
    readOnly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readOnly = false,
    size = 'md',
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null)

    const handleMouseEnter = (index: number) => {
        if (!readOnly) {
            setHoverRating(index)
        }
    }

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(null)
        }
    }

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(index)
        }
    }

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: maxRating }).map((_, i) => {
                const starIndex = i + 1
                // For readOnly, we might want partial stars, but for now full stars
                // Logic: if rating >= starIndex, full.
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= starIndex

                return (
                    <button
                        key={i}
                        type="button"
                        className={cn(
                            "transition-colors focus:outline-none",
                            readOnly ? "cursor-default" : "cursor-pointer"
                        )}
                        onClick={() => handleClick(starIndex)}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readOnly}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}
