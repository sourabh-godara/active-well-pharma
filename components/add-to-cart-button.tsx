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
    variant?: 'default' | 'compact'
    className?: string
}

export function AddToCartButton({ product, quantity = 1, variant = 'default', className = '' }: AddToCartButtonProps) {
    const { addItem } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
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

    const baseClasses = "flex items-center justify-center gap-2 font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    const variantClasses = variant === 'compact' 
        ? "w-full rounded-xl h-11 text-[14px] bg-foreground text-background hover:bg-foreground/90" 
        : "h-12 w-full rounded-full bg-gradient-fresh font-body text-sm text-primary-foreground shadow-sm"

    return (
        <button
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {variant === 'default' && <ShoppingCart className="h-4 w-4" />}
            {outOfStock ? 'Out of Stock' : isAdding ? 'Added ✓' : 'Add to Cart'}
        </button>
    )
}
