'use client'

import { useCart } from '@/app/context/cart-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BuyNowButton({ product, quantity }: { product: any, quantity: number }) {
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
            quantity: quantity
        })
        router.push('/checkout')
    }

    return (
        <button
            onClick={handleBuyNow}
            disabled={product.stock_quantity === 0 || isAdding}
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-8 py-3 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {isAdding ? 'Processing...' : 'Buy Now'}
        </button>
    )
}
