'use client'

import { useCart } from '@/app/context/cart-context'
import { useState } from 'react'

export function AddToCartButton({ product, quantity = 1 }: { product: any, quantity?: number }) {
    const { addItem } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = () => {
        setIsAdding(true)
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: quantity
        })
        setTimeout(() => setIsAdding(false), 500)
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isAdding}
            className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {product.stock_quantity === 0 ? 'Out of Stock' : isAdding ? 'Added!' : 'Add to Cart'}
        </button>
    )
}
