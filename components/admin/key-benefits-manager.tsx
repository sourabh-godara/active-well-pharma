'use client'

import { useState, useRef, useEffect } from 'react'
import { ProductBenefit } from '@/types'
import { addBenefit, deleteBenefit, reorderBenefits } from '@/lib/actions/product-benefits.actions'
import { toast } from 'sonner'
import { Loader2, Plus, X, GripVertical, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeyBenefitsManagerProps {
    productId?: string
    initialBenefits?: ProductBenefit[]
    onChange?: (benefits: ProductBenefit[]) => void
}

export function KeyBenefitsManager({ productId, initialBenefits = [], onChange }: KeyBenefitsManagerProps) {
    const [benefits, setBenefits] = useState<ProductBenefit[]>(initialBenefits)
    const [inputValue, setInputValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [draggedItem, setDraggedItem] = useState<ProductBenefit | null>(null)

    // Notify parent of changes in local mode
    useEffect(() => {
        if (!productId && onChange) {
            onChange(benefits)
        }
    }, [benefits, productId, onChange])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        const text = inputValue.trim()

        if (!text) return
        if (benefits.length >= 6) {
            toast.error('Maximum 6 benefits allowed')
            return
        }

        if (productId) {
            setIsSubmitting(true)
            const result = await addBenefit(productId, text)

            if (result.error) {
                toast.error(result.error)
            } else if (result.benefit) {
                toast.success('Benefit added')
                setBenefits(prev => [...prev, result.benefit!])
                setInputValue('')
            }
            setIsSubmitting(false)
        } else {
            // Local mode
            const newBenefit: ProductBenefit = {
                id: `temp-${Date.now()}`,
                product_id: '',
                benefit_text: text,
                order_index: benefits.length,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            setBenefits(prev => [...prev, newBenefit])
            setInputValue('')
        }
    }

    const handleDelete = async (id: string) => {
        if (productId) {
            // Optimistic update
            const previousBenefits = [...benefits]
            setBenefits(prev => prev.filter(b => b.id !== id))

            const result = await deleteBenefit(id, productId)

            if (result.error) {
                toast.error(result.error)
                setBenefits(previousBenefits) // Revert
            }
        } else {
            setBenefits(prev => prev.filter(b => b.id !== id))
        }
    }

    // Drag and Drop Logic
    const handleDragStart = (e: React.DragEvent, item: ProductBenefit) => {
        setDraggedItem(item)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        if (!draggedItem) return

        const draggedIndex = benefits.findIndex(b => b.id === draggedItem.id)
        if (draggedIndex === index) return

        const newBenefits = [...benefits]
        const [removed] = newBenefits.splice(draggedIndex, 1)
        newBenefits.splice(index, 0, removed)

        setBenefits(newBenefits)
    }

    const handleDragEnd = async () => {
        setDraggedItem(null)

        const updates = benefits.map((b, index) => ({
            id: b.id,
            order_index: index
        }))

        const result = await reorderBenefits(productId, updates)

        if (result.error) {
            toast.error('Reorder failed')
            // Optionally revert, but complex to track previous state specifically for local drag
        } else {
            toast.success('Order updated')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Key Benefits ({benefits.length}/6)</h3>
                <span className="text-xs text-gray-500">Max 120 chars each</span>
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="E.g., Visible glow in 4 weeks"
                    maxLength={120}
                    disabled={isSubmitting || benefits.length >= 6}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !inputValue.trim() || benefits.length >= 6}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </button>
            </form>

            {benefits.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <span className="text-sm text-gray-500">No key benefits added yet.</span>
                </div>
            ) : (
                <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                        <li
                            key={benefit.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, benefit)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                "group flex items-center justify-between gap-3 rounded-md bg-white border border-gray-200 p-3 shadow-sm hover:border-gray-300 cursor-move transition-all",
                                draggedItem?.id === benefit.id ? "opacity-50" : "opacity-100"
                            )}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <GripVertical className="h-5 w-5 text-gray-400 cursor-grab shrink-0" />
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 shrink-0">
                                        <Check className="h-3 w-3 text-green-600" />
                                    </span>
                                    <span className="text-sm text-gray-700 truncate">{benefit.benefit_text}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(benefit.id)}
                                type="button"
                                className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
