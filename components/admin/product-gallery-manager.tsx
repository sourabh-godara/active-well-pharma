'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProductImage } from '@/types'
import { uploadProductImages, deleteProductImage, reorderProductImages } from '@/lib/actions/product-images.actions'
import { toast } from 'sonner'
import { Loader2, Upload, X, GripVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryManagerProps {
    productId: string
    initialImages: ProductImage[]
}

export function ProductGalleryManager({ productId, initialImages }: ProductGalleryManagerProps) {
    const [images, setImages] = useState(initialImages)
    const [isUploading, setIsUploading] = useState(false)
    const [draggedItem, setDraggedItem] = useState<ProductImage | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (images.length + files.length > 5) {
            toast.error(`Limit exceeded. maximum 5 images allowed. You can upload ${5 - images.length} more.`)
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        Array.from(files).forEach(file => {
            formData.append('files', file)
        })

        const result = await uploadProductImages(productId, formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Images uploaded')
            setImages(prev => [...prev, ...(result.images || [])])
            router.refresh()
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
        setIsUploading(false)
    }

    const handleDelete = async (imageId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        // Optimistic update
        const previousImages = [...images]
        setImages(prev => prev.filter(img => img.id !== imageId))

        const result = await deleteProductImage(imageId, productId)

        if (result.error) {
            toast.error(result.error)
            setImages(previousImages) // Revert
        } else {
            toast.success('Image deleted')
            router.refresh()
        }
    }

    // Drag and Drop Logic
    const handleDragStart = (e: React.DragEvent, item: ProductImage) => {
        setDraggedItem(item)
        e.dataTransfer.effectAllowed = 'move'
        // Create a transparent drag image or customize if needed
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        if (!draggedItem) return

        const draggedIndex = images.findIndex(img => img.id === draggedItem.id)
        if (draggedIndex === index) return

        // Reorder locally
        const newImages = [...images]
        const [removed] = newImages.splice(draggedIndex, 1)
        newImages.splice(index, 0, removed)

        setImages(newImages)
    }

    const handleDragEnd = async () => {
        setDraggedItem(null)

        // Save new order
        // Recalculate order indices based on current array position
        const updates = images.map((img, index) => ({
            id: img.id,
            order_index: index + 1 // 1-based index
        }))

        // Call server action
        const result = await reorderProductImages(productId, updates)

        if (result.error) {
            toast.error('Reorder failed')
            router.refresh() // Revert to server state
        } else {
            toast.success('Order updated')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Gallery Images ({images.length}/5)</h3>
                <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={isUploading || images.length >= 5}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || images.length >= 5}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload Images
                    </button>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <span className="mt-2 block text-sm font-semibold text-gray-900">No gallery images</span>
                    <span className="mt-2 block text-sm text-gray-500">Upload additional images for the product gallery.</span>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {images.map((image, index) => (
                        <li
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, image)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                "group relative aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-200 cursor-move transition-transform active:scale-95",
                                draggedItem?.id === image.id ? "opacity-50" : "opacity-100"
                            )}
                        >
                            <Image
                                src={image.image_url}
                                alt="Product gallery image"
                                fill
                                className="object-cover"
                                sizes="200px"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <GripVertical className="h-6 w-6 text-white cursor-grab" />
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="rounded-full bg-white/20 p-2 text-white hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                {index + 1}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
