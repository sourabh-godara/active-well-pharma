
'use client'

import { Promotion } from '@/types'
import { deletePromotion, togglePromotionStatus } from '@/lib/actions/promotion.actions'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PromotionForm from '@/components/admin/promotions/promotion-form'
import { toast } from 'sonner'

export function PromotionList({ initialPromotions }: { initialPromotions: Promotion[] }) {
    const [promotions, setPromotions] = useState(initialPromotions)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined)

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            try {
                await deletePromotion(id)
                toast.success('Promotion deleted')
            } catch (error) {
                toast.error('Failed to delete promotion')
            }
        }
    }

    const openCreateModal = () => {
        setEditingPromotion(undefined)
        setIsModalOpen(true)
    }

    const openEditModal = (promotion: Promotion) => {
        setEditingPromotion(promotion)
        setIsModalOpen(true)
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openCreateModal}
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <div className="flex items-center gap-x-1">
                        <Plus className="h-4 w-4" />
                        Add Promotion
                    </div>
                </button>
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {initialPromotions.map((promotion) => (
                        <li key={promotion.id}>
                            <div className="block hover:bg-gray-50">
                                <div className="flex items-center px-4 py-4 sm:px-6">
                                    <div className="flex min-w-0 flex-1 items-center">
                                        <div className="flex-shrink-0">
                                            {promotion.image_url ? (
                                                <img className="h-12 w-12 rounded-full object-cover" src={promotion.image_url} alt="" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    P
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                            <div>
                                                <p className="truncate text-sm font-medium text-indigo-600">{promotion.title}</p>
                                                <p className="mt-2 flex items-center text-xs text-gray-500">
                                                    {promotion.trigger_type} ({promotion.delay_seconds}s)
                                                </p>
                                            </div>
                                            <div className="hidden md:block">
                                                <div>
                                                    <p className="text-sm text-gray-900">
                                                        {promotion.coupon_code ? (
                                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                {promotion.coupon_code}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">No Code</span>
                                                        )}
                                                    </p>
                                                    {promotion.is_active ? (
                                                        <p className="mt-2 text-xs text-green-600 font-semibold">Active</p>
                                                    ) : (
                                                        <p className="mt-2 text-xs text-gray-500">Inactive</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <button
                                            onClick={() => openEditModal(promotion)}
                                            className="p-1 text-gray-400 hover:text-indigo-600"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(promotion.id)}
                                            className="p-1 text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">{editingPromotion ? 'Edit Promotion' : 'New Promotion'}</h2>
                        <PromotionForm promotion={editingPromotion} closeModal={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}
