'use client'

import { useCart } from '@/app/context/cart-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BuyNowProduct {
    id: string
    name: string
    price: number
    image_url: string | null
    stock_quantity: number
}

interface BuyNowButtonProps {
    product: BuyNowProduct
    quantity: number
}

export function BuyNowButton({ product, quantity }: BuyNowButtonProps) {
    const { addItem } = useCart()
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)

    const handleBuyNow = () => {
        setIsAdding(true)
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity,
        })
        router.push('/cart')
    }

    return (
        <button
            onClick={handleBuyNow}
            disabled={product.stock_quantity === 0 || isAdding}
            className="h-12 w-full flex items-center justify-center rounded-full bg-secondary font-body font-semibold text-sm text-secondary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isAdding ? 'Processing…' : 'Buy Now'}
        </button>
    )
}
