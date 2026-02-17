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
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide py-2 md:py-0 px-1">
                    {images.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-md overflow-hidden border-2 transition-all",
                                selectedImage === image
                                    ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2"
                                    : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="96px"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div className="flex-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        className="object-cover object-center"
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </div>
    )
}
