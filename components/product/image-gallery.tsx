'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0])

    if (!images || images.length === 0) {
        return (
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-contain object-center p-4"
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
                    {images.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all",
                                selectedImage === image
                                    ? "border-green-600 ring-2 ring-green-600 ring-offset-2"
                                    : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
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
