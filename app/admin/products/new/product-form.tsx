'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import Image from 'next/image'
import { ImagePlus, Plus, X, Loader2, Check, Trash2, UploadCloud } from 'lucide-react'
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? (isCreate ? 'Creating…' : 'Saving…') : (isCreate ? 'Create Product' : 'Save Changes')}
        </button>
    )
}

const inputCls =
    'block w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all'

function SectionDivider({ title, description }: { title: string; description?: string }) {
    return (
        <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
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

    const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(product?.image_url || null)
    
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

    const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (primaryImagePreview && primaryImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(primaryImagePreview)
            }
            setPrimaryImagePreview(URL.createObjectURL(file))
        }
    }

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
            } else {
                toast.success('Gallery image deleted')
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
        <form action={wrappedAction} className="max-w-4xl mx-auto pb-12">
            {/* Hidden fields */}
            {product && <input type="hidden" name="id" value={product.id} />}
            <input type="hidden" name="benefits" value={JSON.stringify(benefits.map(b => b.text))} />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isCreate ? 'Create New Product' : 'Edit Product'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {isCreate
                        ? 'Fill in the details below to add a new product to your catalog.'
                        : `Updating details for: ${product?.name}`}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Left Column: Main Details ── */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <SectionDivider title="General Information" />
                        
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input type="text" name="name" id="name" required defaultValue={product?.name}
                                    placeholder="e.g. Green Detox Elixir" className={inputCls} />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea name="description" id="description" rows={4} required
                                    defaultValue={product?.description ?? ''}
                                    placeholder="Describe the product and its benefits…"
                                    className={inputCls} />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Price (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input type="number" name="price" id="price" step="0.01" min="0" required
                                            defaultValue={product?.price} placeholder="0.00" className={`${inputCls} pl-8`} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Stock Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" name="stock_quantity" id="stock_quantity" min="0" required
                                        defaultValue={product?.stock_quantity} placeholder="100" className={inputCls} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <SectionDivider title="Key Benefits" description={`Highlight the main selling points. ${benefits.length}/6 used.`} />
                        
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input type="text" value={benefitInput} onChange={e => setBenefitInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBenefit() } }}
                                    placeholder="e.g. Visible glow in 4 weeks" maxLength={120}
                                    disabled={benefits.length >= 6}
                                    className={`${inputCls} flex-1`} />
                                <button type="button" onClick={addBenefit}
                                    disabled={!benefitInput.trim() || benefits.length >= 6}
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 transition-colors">
                                    <Plus className="h-4 w-4" /> Add
                                </button>
                            </div>

                            {benefits.length === 0 ? (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500">No benefits added yet.</p>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {benefits.map(b => (
                                        <li key={b.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white shadow-sm px-4 py-3 group">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                                                <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                                            </span>
                                            <span className="flex-1 text-sm font-medium text-gray-700">{b.text}</span>
                                            <button type="button" onClick={() => setBenefits(prev => prev.filter(x => x.id !== b.id))}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-red-50 rounded-md p-1.5" aria-label="Remove">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Media & Status ── */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <SectionDivider title="Media" />
                        
                        <div className="space-y-6">
                            {/* Primary Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Image {isCreate && <span className="text-red-500">*</span>}
                                </label>
                                
                                <div className="relative group">
                                    <div className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative flex flex-col items-center justify-center cursor-pointer">
                                        {primaryImagePreview ? (
                                            <Image src={primaryImagePreview} alt="Primary Preview" fill className="object-contain p-2" unoptimized />
                                        ) : (
                                            <div className="text-center p-4">
                                                <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">Click to upload</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                        {/* Invisible file input covering the area */}
                                        <input type="file" name="image" id="image" accept="image/*" required={isCreate}
                                            onChange={handlePrimaryImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </div>
                                    {primaryImagePreview && (
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm pointer-events-none">
                                            Primary
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Images */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gallery
                                    </label>
                                    <span className="text-xs text-gray-400">{gallery.length}/5 used</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {gallery.map(item => (
                                        <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                                            <Image src={item.url} alt="Gallery" fill className="object-contain p-1" unoptimized />
                                            {!item.isExisting && (
                                                <span className="absolute bottom-1 left-1 rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold text-white leading-none shadow-sm">New</span>
                                            )}
                                            <button type="button" onClick={() => removeGalleryItem(item)}
                                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 shadow-sm text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                aria-label="Remove">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {gallery.length < 5 && (
                                    <>
                                        <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
                                            onChange={e => { handleGalleryFiles(e.target.files); e.target.value = '' }} />
                                        <button type="button" onClick={() => galleryInputRef.current?.click()}
                                            className="flex items-center gap-2 w-full justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                            <ImagePlus className="h-4 w-4" />
                                            Add Gallery Images
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <SectionDivider title="Visibility" />
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="flex items-center h-5">
                                <input id="is_active" name="is_active" type="checkbox"
                                    defaultChecked={product?.is_active ?? true}
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Active Status</span>
                                <span className="text-xs text-gray-500 mt-0.5">When disabled, this product will be hidden from the storefront.</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* ── Sticky Footer Actions ── */}
            <div className="fixed bottom-0 left-0 right-0 sm:left-64 z-10 bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <a href="/admin/products"
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">
                    Cancel
                </a>
                <SubmitButton isCreate={isCreate} />
            </div>
        </form>
    )
}
