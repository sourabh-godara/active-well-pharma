'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] ?? '')

    if (!images || images.length === 0) {
        return (
            <div className="w-full rounded-2xl bg-muted flex items-center justify-center aspect-square text-muted-foreground text-sm">
                No Image
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full rounded-2xl overflow-hidden border border-border bg-white">
                <AspectRatio ratio={1}>
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        className="object-contain p-6 transition-opacity duration-200"
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </AspectRatio>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            aria-label={`View image ${idx + 1}`}
                            className={cn(
                                'relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-150 bg-white',
                                selectedImage === img
                                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                                    : 'border-border hover:border-primary/40'
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="80px"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
