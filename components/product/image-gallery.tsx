'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import useEmblaCarousel from 'embla-carousel-react'

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index)
        },
        [emblaApi]
    )

    if (!images || images.length === 0) {
        return (
            <div className="w-full rounded-2xl bg-muted flex items-center justify-center aspect-square text-muted-foreground text-sm">
                No Image
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Carousel */}
            <div className="relative w-full rounded md:rounded-2xl  overflow-hidden bg-white aspect-[4/5] lg:aspect-square">
                <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                    <div className="flex h-full touch-pan-y">
                        {images.map((img, idx) => (
                            <div className="relative h-full flex-[0_0_100%] min-w-0" key={idx}>
                                <Image
                                    src={img}
                                    alt={`${productName} - Image ${idx + 1}`}
                                    fill
                                    className="object-contain transition-opacity duration-200"
                                    priority={idx === 0}
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            aria-label={`View image ${idx + 1}`}
                            className={cn(
                                'relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-150 bg-white',
                                selectedIndex === idx
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
