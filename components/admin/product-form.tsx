'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import Image from 'next/image'
import { ImagePlus, Plus, X, Loader2, Check, GripVertical, Trash2 } from 'lucide-react'
import { type ActionResponse } from '@/lib/errors'
import { ProductWithGallery } from '@/types'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { deleteProductImage } from '@/lib/actions/product-images.actions'

// ─── Types ─────────────────────────────────────────────────────────────────

interface GalleryPreview {
    id: string          // temp-xxx for new, real UUID for existing
    url: string         // object URL for new, real URL for existing
    file?: File         // only for new uploads
    isExisting: boolean
}

interface BenefitItem {
    id: string
    text: string
}

interface ProductFormProps {
    product?: ProductWithGallery  // undefined = create mode
}

// ─── Submit Button ──────────────────────────────────────────────────────────

function SubmitButton({ isCreate }: { isCreate: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? (isCreate ? 'Creating…' : 'Saving…') : (isCreate ? 'Create Product' : 'Save Changes')}
        </button>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProductForm({ product }: ProductFormProps) {
    const isCreate = !product
    const initialState: ActionResponse = { success: true, message: 'INITIAL_STATE' }

    const action = isCreate ? createProduct : updateProduct
    const [state, formAction] = useActionState(action, initialState)

    // ── Gallery state ──────────────────────────────────────────────────────
    const [gallery, setGallery] = useState<GalleryPreview[]>(() => {
        if (!product?.images) return []
        return product.images.map(img => ({
            id: img.id,
            url: img.image_url,
            isExisting: true,
        }))
    })
    const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([])
    const galleryInputRef = useRef<HTMLInputElement>(null)

    // ── Benefits state ─────────────────────────────────────────────────────
    const [benefits, setBenefits] = useState<BenefitItem[]>(() => {
        if (!product?.benefits) return []
        return product.benefits.map(b => ({ id: b.id, text: b.benefit_text }))
    })
    const [benefitInput, setBenefitInput] = useState('')

    // ── Toast on result ────────────────────────────────────────────────────
    useEffect(() => {
        if ((state as any).message === 'INITIAL_STATE') return
        if (!state.success) toast.error((state as any).error?.message ?? 'Something went wrong')
        else if (!isCreate) toast.success('Product updated!')
    }, [state, isCreate])

    // ── Gallery handlers ───────────────────────────────────────────────────
    const handleGalleryFiles = useCallback((files: FileList | null) => {
        if (!files) return
        const newItems: GalleryPreview[] = []
        const remaining = 5 - gallery.length

        Array.from(files).slice(0, remaining).forEach(file => {
            if (!file.type.startsWith('image/')) return
            newItems.push({
                id: `temp-${Date.now()}-${Math.random()}`,
                url: URL.createObjectURL(file),
                file,
                isExisting: false,
            })
        })

        if (remaining <= 0) {
            toast.error('Maximum 5 gallery images allowed')
            return
        }
        setGallery(prev => [...prev, ...newItems])
    }, [gallery.length])

    const removeGalleryItem = useCallback(async (item: GalleryPreview) => {
        if (item.isExisting && product) {
            // Optimistically remove from UI
            setGallery(prev => prev.filter(g => g.id !== item.id))
            setRemovedExistingIds(prev => [...prev, item.id])
            // Delete from DB immediately
            const result = await deleteProductImage(item.id, product.id)
            if (result.error) {
                toast.error(result.error)
                // Revert
                setGallery(prev => [...prev, item])
                setRemovedExistingIds(prev => prev.filter(id => id !== item.id))
            }
        } else {
            // Just remove from local state — revoke object URL to avoid memory leak
            if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url)
            setGallery(prev => prev.filter(g => g.id !== item.id))
        }
    }, [product])

    // ── Benefits handlers ──────────────────────────────────────────────────
    const addBenefit = () => {
        const text = benefitInput.trim()
        if (!text) return
        if (benefits.length >= 6) { toast.error('Maximum 6 benefits'); return }
        if (text.length > 120) { toast.error('Max 120 characters per benefit'); return }
        setBenefits(prev => [...prev, { id: `temp-${Date.now()}`, text }])
        setBenefitInput('')
    }

    const removeBenefit = (id: string) => setBenefits(prev => prev.filter(b => b.id !== id))

    // ── Shared input class ─────────────────────────────────────────────────
    const inputCls = 'block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

    // ── Section heading helper ─────────────────────────────────────────────
    const SectionHeading = ({ title, description }: { title: string; description: string }) => (
        <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
    )

    return (
        <form action={formAction} className="space-y-8">
            {/* Hidden product id for edit mode */}
            {product && <input type="hidden" name="id" value={product.id} />}

            {/* Hidden benefits serialization */}
            <input
                type="hidden"
                name="benefits"
                value={JSON.stringify(benefits.map(b => b.text))}
            />

            {/* Hidden gallery files are handled via real file input below */}

            {/* ── Section 1: Product Details ───────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeading
                    title="Product Details"
                    description="Core product information visible to customers."
                />

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={product?.name}
                            placeholder="e.g. Green Detox Elixir"
                            className={inputCls}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            required
                            defaultValue={product?.description ?? ''}
                            placeholder="Describe the product, its benefits and ingredients…"
                            className={inputCls}
                        />
                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                step="0.01"
                                min="0"
                                required
                                defaultValue={product?.price}
                                placeholder="499"
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label htmlFor="stock_quantity" className="block text-xs font-medium text-gray-700 mb-1">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock_quantity"
                                id="stock_quantity"
                                min="0"
                                required
                                defaultValue={product?.stock_quantity}
                                placeholder="100"
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Primary Image */}
                    <div>
                        <label htmlFor="image" className="block text-xs font-medium text-gray-700 mb-1">
                            Primary Image {isCreate && <span className="text-red-500">*</span>}
                            {!isCreate && <span className="text-gray-400 font-normal"> (leave blank to keep existing)</span>}
                        </label>
                        {product?.image_url && (
                            <div className="mb-2 relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={product.image_url} alt="Current" fill className="object-cover" unoptimized />
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            required={isCreate}
                            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 pt-1">
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            defaultChecked={product?.is_active ?? true}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Active — visible in the store
                        </label>
                    </div>
                </div>
            </div>

            {/* ── Section 2: Image Gallery ─────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeading
                    title="Image Gallery"
                    description={`Additional product images. Max 5. ${gallery.length}/5 used.`}
                />

                {/* Thumbnail grid */}
                {gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        {gallery.map(item => (
                            <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <Image
                                    src={item.url}
                                    alt="Gallery image"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                {!item.isExisting && (
                                    <span className="absolute top-1 left-1 rounded bg-indigo-600 px-1 py-0.5 text-[10px] font-semibold text-white leading-none">
                                        New
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeGalleryItem(item)}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                    aria-label="Remove image"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload button */}
                {gallery.length < 5 && (
                    <>
                        <input
                            ref={galleryInputRef}
                            type="file"
                            name="gallery_images"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleGalleryFiles(e.target.files)}
                        />
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors w-full justify-center"
                        >
                            <ImagePlus className="h-4 w-4" />
                            Add gallery images ({5 - gallery.length} remaining)
                        </button>
                    </>
                )}

                {gallery.length === 0 && (
                    <p className="text-xs text-gray-400 text-center mt-2">No gallery images yet.</p>
                )}
            </div>

            {/* ── Section 3: Key Benefits ──────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <SectionHeading
                    title="Key Benefits"
                    description={`Bullet points shown on the product page. Max 6. ${benefits.length}/6 used.`}
                />

                {/* Add input */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={benefitInput}
                        onChange={e => setBenefitInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBenefit() } }}
                        placeholder="e.g. Visible glow in 4 weeks"
                        maxLength={120}
                        disabled={benefits.length >= 6}
                        className={`${inputCls} flex-1`}
                    />
                    <button
                        type="button"
                        onClick={addBenefit}
                        disabled={!benefitInput.trim() || benefits.length >= 6}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </button>
                </div>

                {/* Benefits list */}
                {benefits.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center">
                        <p className="text-xs text-gray-400">No benefits added yet.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {benefits.map(benefit => (
                            <li
                                key={benefit.id}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-3 w-3 text-green-600 stroke-3" />
                                </span>
                                <span className="flex-1 text-sm text-gray-700 truncate">{benefit.text}</span>
                                <button
                                    type="button"
                                    onClick={() => removeBenefit(benefit.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                    aria-label="Remove benefit"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Submit ────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
                <a
                    href="/admin/products"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Cancel
                </a>
                <SubmitButton isCreate={isCreate} />
            </div>
        </form>
    )
}
