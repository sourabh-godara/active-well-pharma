'use client'

import { useCart } from '@/app/context/cart-context'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

interface AddToCartProduct {
    id: string
    name: string
    price: number
    image_url: string | null
    stock_quantity: number
}

interface AddToCartButtonProps {
    product: AddToCartProduct
    quantity?: number
}

export function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
    const { addItem } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = () => {
        setIsAdding(true)
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity,
        })
        setTimeout(() => setIsAdding(false), 700)
    }

    const outOfStock = product.stock_quantity === 0

    return (
        <button
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding}
            className="h-12 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-fresh font-body font-semibold text-sm text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? 'Out of Stock' : isAdding ? 'Added ✓' : 'Add to Cart'}
        </button>
    )
}
