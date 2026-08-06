'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import Image from 'next/image'
import { ImagePlus, Plus, X, Loader2, Check, Trash2 } from 'lucide-react'
import { type ActionResponse } from '@/lib/errors'
import { ProductWithGallery } from '@/types'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { deleteProductImage } from '@/lib/actions/product-images.actions'

interface GalleryPreview {
    id: string
    url: string
    file?: File
    isExisting: boolean
}

interface BenefitItem {
    id: string
    text: string
}

export interface ProductFormProps {
    product?: ProductWithGallery
}


function SubmitButton({ isCreate }: { isCreate: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? (isCreate ? 'Creating…' : 'Saving…') : (isCreate ? 'Create Product' : 'Save Changes')}
        </button>
    )
}


const inputCls =
    'block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'


function SectionDivider({ title, description }: { title: string; description?: string }) {
    return (
        <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
    )
}


export default function ProductForm({ product }: ProductFormProps) {
    const isCreate = !product
    const initialState: ActionResponse = { success: true, message: 'INITIAL_STATE' }

    const [state, formAction] = useActionState(
        isCreate ? createProduct : updateProduct,
        initialState
    )

    const [gallery, setGallery] = useState<GalleryPreview[]>(() =>
        (product?.images ?? []).map(img => ({ id: img.id, url: img.image_url, isExisting: true }))
    )
    const galleryRef = useRef<GalleryPreview[]>(gallery)
    galleryRef.current = gallery
    const galleryInputRef = useRef<HTMLInputElement>(null)

    const [benefits, setBenefits] = useState<BenefitItem[]>(() =>
        (product?.benefits ?? []).map(b => ({ id: b.id, text: b.benefit_text }))
    )
    const [benefitInput, setBenefitInput] = useState('')

    useEffect(() => {
        if ((state as any).message === 'INITIAL_STATE') return
        if (!state.success) toast.error((state as any).error?.message ?? 'Something went wrong')
        else if (!isCreate) toast.success('Product updated!')
    }, [state, isCreate])

    const handleGalleryFiles = useCallback((files: FileList | null) => {
        if (!files) return
        const remaining = 5 - gallery.length
        if (remaining <= 0) { toast.error('Maximum 5 gallery images allowed'); return }
        const items: GalleryPreview[] = Array.from(files)
            .slice(0, remaining)
            .filter(f => f.type.startsWith('image/'))
            .map(f => ({ id: `temp-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), file: f, isExisting: false }))
        setGallery(prev => [...prev, ...items])
    }, [gallery.length])

    const removeGalleryItem = useCallback(async (item: GalleryPreview) => {
        if (item.isExisting && product) {
            setGallery(prev => prev.filter(g => g.id !== item.id))
            const result = await deleteProductImage(item.id, product.id)
            if (result.error) {
                toast.error(result.error)
                setGallery(prev => [...prev, item])
            }
        } else {
            if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url)
            setGallery(prev => prev.filter(g => g.id !== item.id))
        }
    }, [product])

    const addBenefit = () => {
        const text = benefitInput.trim()
        if (!text) return
        if (benefits.length >= 6) { toast.error('Maximum 6 benefits'); return }
        if (text.length > 120) { toast.error('Max 120 characters per benefit'); return }
        setBenefits(prev => [...prev, { id: `temp-${Date.now()}`, text }])
        setBenefitInput('')
    }

    // Wrap the server action to inject gallery files from React state
    // into FormData — the native file input only holds the last batch
    const wrappedAction = useCallback(
        (formData: FormData) => {
            formData.delete('gallery_images')
            for (const item of galleryRef.current) {
                if (!item.isExisting && item.file) {
                    formData.append('gallery_images', item.file)
                }
            }
            return formAction(formData)
        },
        [formAction]
    )

    return (
        <form action={wrappedAction}>
            {/* Hidden fields */}
            {product && <input type="hidden" name="id" value={product.id} />}
            <input type="hidden" name="benefits" value={JSON.stringify(benefits.map(b => b.text))} />

            {/* ── Single card ─────────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="px-6 py-6 space-y-5">

                    {/* Card title */}
                    <div>
                        <h1 className="text-base font-semibold text-gray-900">
                            {isCreate ? 'Create New Product' : 'Edit Product'}
                        </h1>
                        <p className="mt-0.5 text-xs text-gray-500">
                            {isCreate
                                ? 'Fill in all sections below and click Create Product.'
                                : `Editing: ${product?.name}`}
                        </p>
                    </div>

                    {/* ── Section 1: Product Details ─────────────── */}
                    <SectionDivider title="Product Details" description="Core information visible to customers." />

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="name" id="name" required defaultValue={product?.name}
                            placeholder="e.g. Green Detox Elixir" className={inputCls} />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea name="description" id="description" rows={3} required
                            defaultValue={product?.description ?? ''}
                            placeholder="Describe the product…"
                            className={inputCls} />
                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input type="number" name="price" id="price" step="0.01" min="0" required
                                defaultValue={product?.price} placeholder="499" className={inputCls} />
                        </div>
                        <div>
                            <label htmlFor="stock_quantity" className="block text-xs font-medium text-gray-700 mb-1">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input type="number" name="stock_quantity" id="stock_quantity" min="0" required
                                defaultValue={product?.stock_quantity} placeholder="100" className={inputCls} />
                        </div>
                    </div>

                    {/* Primary Image */}
                    <div>
                        <label htmlFor="image" className="block text-xs font-medium text-gray-700 mb-1">
                            Primary Image {isCreate && <span className="text-red-500">*</span>}
                            {!isCreate && <span className="text-gray-400 font-normal"> — leave blank to keep current</span>}
                        </label>
                        {product?.image_url && (
                            <div className="mb-2 relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={product.image_url} alt="Current" fill className="object-cover" unoptimized />
                            </div>
                        )}
                        <input type="file" name="image" id="image" accept="image/*" required={isCreate}
                            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2.5">
                        <input id="is_active" name="is_active" type="checkbox"
                            defaultChecked={product?.is_active ?? true}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Active — visible in the store</label>
                    </div>

                    {/* ── Section 2: Image Gallery ───────────────── */}
                    <SectionDivider
                        title="Image Gallery"
                        description={`Additional images shown in the product gallery. ${gallery.length}/5 used.`}
                    />

                    {gallery.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {gallery.map(item => (
                                <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                    <Image src={item.url} alt="Gallery" fill className="object-cover" unoptimized />
                                    {!item.isExisting && (
                                        <span className="absolute top-1 left-1 rounded bg-indigo-600 px-1 py-0.5 text-[9px] font-semibold text-white leading-none">New</span>
                                    )}
                                    <button type="button" onClick={() => removeGalleryItem(item)}
                                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {gallery.length < 5 && (
                        <>
                            <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
                                onChange={e => { handleGalleryFiles(e.target.files); e.target.value = '' }} />
                            <button type="button" onClick={() => galleryInputRef.current?.click()}
                                className="flex items-center gap-2 w-full justify-center rounded-md border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                                <ImagePlus className="h-4 w-4" />
                                Add images ({5 - gallery.length} remaining)
                            </button>
                        </>
                    )}

                    {/* ── Section 3: Key Benefits ────────────────── */}
                    <SectionDivider
                        title="Key Benefits"
                        description={`Shown as checkmarks on the product page. ${benefits.length}/6 used.`}
                    />

                    <div className="flex gap-2">
                        <input type="text" value={benefitInput} onChange={e => setBenefitInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBenefit() } }}
                            placeholder="e.g. Visible glow in 4 weeks" maxLength={120}
                            disabled={benefits.length >= 6}
                            className={`${inputCls} flex-1`} />
                        <button type="button" onClick={addBenefit}
                            disabled={!benefitInput.trim() || benefits.length >= 6}
                            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <Plus className="h-4 w-4" /> Add
                        </button>
                    </div>

                    {benefits.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-4">
                            No benefits added yet.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {benefits.map(b => (
                                <li key={b.id} className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-3 w-3 text-green-600 stroke-3" />
                                    </span>
                                    <span className="flex-1 text-sm text-gray-700 truncate">{b.text}</span>
                                    <button type="button" onClick={() => setBenefits(prev => prev.filter(x => x.id !== b.id))}
                                        className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

                {/* ── Footer ─────────────────────────────────────── */}
                <div className="flex items-center gap-3 border-t border-gray-200 px-6 py-4">
                    <SubmitButton isCreate={isCreate} />
                    <a href="/admin/products"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Cancel
                    </a>
                </div>
            </div>
        </form>
    )
}
