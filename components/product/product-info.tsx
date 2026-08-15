'use client'

import { useState } from 'react'
import { StarRating } from '@/components/reviews/star-rating'
import { ProductBenefits } from './product-benefits'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { BuyNowButton } from './buy-now-button'
import { TrustBadges } from './trust-badges'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { ProductWithGallery } from '@/types'

interface ProductInfoProps {
    product: ProductWithGallery
    averageRating: number
    totalReviews: number
}

export function ProductInfo({ product, averageRating, totalReviews }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1)

    const increment = () => setQuantity(prev => Math.min(prev + 1, product.stock_quantity))
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

    const originalPrice = Math.round(product.price * 1.25)
    const savings = originalPrice - product.price

    return (
        <div className="flex flex-col gap-5 font-body">

            {/* Product Name */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {product.name}
            </h1>

            {/* Rating */}
            {totalReviews > 0 && (
                <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} readOnly size="sm" />
                    <span className="text-sm font-semibold text-foreground">{averageRating}</span>
                    <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</p>

            </div>

            {/* Dynamic Key Benefits from DB */}
            <ProductBenefits benefits={product.benefits ?? []} />

            {/* Stock */}
            {product.stock_quantity > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                    ✓ In stock
                </p>
            ) : (
                <p className="text-sm text-destructive font-medium">Out of stock</p>
            )}

            {/* Quantity + Add to Cart row */}
            <div className="flex items-center gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-full border border-border bg-background shadow-sm h-12">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
                        aria-label="Decrease"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-foreground text-sm select-none">
                        {quantity}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increment}
                        disabled={quantity >= product.stock_quantity || product.stock_quantity === 0}
                        className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
                        aria-label="Increase"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Add to Cart — takes rest of space */}
                <div className="flex-1">
                    <AddToCartButton product={product} quantity={quantity} />
                </div>
            </div>

            {/* Buy Now — full width */}
            <BuyNowButton product={product} quantity={quantity} />

            {/* Trust Badges */}
            <TrustBadges />
        </div>
    )
}
