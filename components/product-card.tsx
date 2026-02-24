import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/reviews/star-rating'
import { Product } from '@/types'
import { ShoppingBag, Star } from 'lucide-react'
import { Button } from './ui/button'

interface ProductWithRating extends Product {
    average_rating: number
    total_reviews: number
}

interface ProductCardProps {
    product: ProductWithRating
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/product/${product.id}`}
            key={product.name}
            className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={product.image_url!}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    unoptimized
                />

                <Button className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-background">
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                </Button>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{'SKIN GLOW'}</p>
                <h3 className="font-display text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                        <Star color='orange' fill='orange' className="w-3.5 h-3.5 text-sunshine" />
                        <span className="font-body text-xs font-semibold text-foreground">{product.average_rating}</span>
                    </div>
                    <span className="font-body text-xs text-muted-foreground">({product.total_reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-body text-base font-bold text-foreground">₹{product.price}</span>
                    <span className="font-body text-sm text-muted-foreground line-through">₹{product.price + 300}</span>
                </div>
            </div>
        </Link>
    )
}
