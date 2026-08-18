'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import { AddToCartButton } from './add-to-cart-button'
import { Product } from '@/types'
import { useState } from 'react'

export interface ProductWithRating extends Product {
  average_rating: number
  total_reviews: number
}

interface ProductCardProps {
  product: ProductWithRating
}

// Generic benefit text per category — no % claims
const BENEFIT_TEXT = 'Supports Daily Wellness'

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const [wishlisted, setWishlisted] = useState(false)


  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(prev => !prev)
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-border/40 hover:border-transparent transition-all duration-500 overflow-hidden"
      style={{
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.02)',
      }}
      aria-label={`${product.name} — ₹${product.price}`}
    >
      {/* Subtle hover shadow via pseudo-element for smoother transition */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.08)',
        }}
        aria-hidden="true"
      />

      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f7f5] rounded-t-2xl z-10">
        <Image
          src={product.image_url!}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />

        {/* Wishlist button — top right, always visible */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-4 right-4 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out"
        >
          <Heart
            className={`w-[16px] h-[16px] transition-colors duration-300 ${wishlisted ? 'fill-accent text-accent' : 'text-foreground/40 hover:text-accent'
              }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 lg:p-6 z-10 bg-white rounded-b-2xl">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
            Skin Glow
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-foreground/80">{product.average_rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-foreground text-base leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Benefit text */}
        <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
          {BENEFIT_TEXT}
        </p>

        {/* Spacer to push price+button to bottom */}
        <div className="flex-1" />

        {/* Price row */}
        <span className="text-lg font-bold mb-4 text-foreground tracking-tight">₹{product.price}</span>

        {/* Add to Cart — always visible */}
        <AddToCartButton
          product={product}
          variant="compact"
          className="hover:scale-[1.02] active:scale-[0.98] mt-auto"
        />
      </div>
    </Link>
  )
}
