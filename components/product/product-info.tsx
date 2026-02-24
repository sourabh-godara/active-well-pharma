'use client'

import { useState } from 'react'
import { StarRating } from '@/components/reviews/star-rating'
import { ProductBenefits } from './product-benefits'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { BuyNowButton } from './buy-now-button'
import { TrustBadges } from './trust-badges'
import { Minus, Plus } from 'lucide-react'

export function ProductInfo({ product, averageRating, totalReviews }: { product: any, averageRating: number, totalReviews: number }) {
    const [quantity, setQuantity] = useState(1)

    const increment = () => setQuantity(prev => prev + 1)
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

    const originalPrice = Math.round(product.price * 1.25) // Fake original price for demo (20% off roughly)
    const savings = originalPrice - product.price

    return (
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 font-sans">
            {/* Category / Badge */}
            <div className="mb-4">
                <span className="text-xs font-bold tracking-wider text-red-500 uppercase">SKIN GLOW</span>
            </div>

            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-2 mb-6">
                <StarRating rating={averageRating} readOnly size="sm" />
                <span className="text-sm font-medium text-gray-900">{averageRating}</span>
                <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
            </div>

            <div className="flex items-baseline space-x-4 mb-6">
                <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                <p className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Save ₹{savings.toLocaleString()}
                </span>
            </div>

            {/* Benefits */}
            <ProductBenefits benefits={product.benefits || []} />

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <div className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span>100% plant-based ingredients</span>
            </div>


            {/* Quantity and Actions */}
            <div className="mt-8 space-y-4">
                <div className="flex items-center rounded-md border border-gray-300 w-max">
                    <button
                        onClick={decrement}
                        className="p-3 text-gray-600 hover:text-gray-900 focus:outline-none"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-gray-900 font-medium">{quantity}</span>
                    <button
                        onClick={increment}
                        className="p-3 text-gray-600 hover:text-gray-900 focus:outline-none"
                        disabled={quantity >= product.stock_quantity}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex gap-4">
                    <AddToCartButton product={product} quantity={quantity} />
                    <BuyNowButton product={product} quantity={quantity} />
                </div>
            </div>

            <TrustBadges />
        </div>
    )
}
