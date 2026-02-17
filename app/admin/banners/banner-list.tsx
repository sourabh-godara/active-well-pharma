
'use client'

import { Banner } from '@/types'
import { deleteBanner, toggleBannerStatus, reorderBanners } from '@/lib/actions/banner.actions'
import { useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import BannerForm from '@/components/admin/banners/banner-form'
import { toast } from 'sonner'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export function BannerList({ initialBanners }: { initialBanners: Banner[] }) {
    const [banners, setBanners] = useState(initialBanners)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined)

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            try {
                await deleteBanner(id)
                toast.success('Banner deleted')
            } catch (error) {
                toast.error('Failed to delete banner')
            }
        }
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleBannerStatus(id, !currentStatus)
            toast.success('Status updated')
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const openCreateModal = () => {
        setEditingBanner(undefined)
        setIsModalOpen(true)
    }

    const openEditModal = (banner: Banner) => {
        setEditingBanner(banner)
        setIsModalOpen(true)
    }

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(banners)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Optimistic update
        setBanners(items)

        // Prepare update payload
        const updates = items.map((item, index) => ({
            id: item.id,
            order_index: index
        }))

        try {
            await reorderBanners(updates)
            toast.success('Order updated')
        } catch (error) {
            toast.error('Failed to update order')
            setBanners(initialBanners) // Revert on failure
        }
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
                        Add Banner
                    </div>
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="banners">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                        >
                            {banners.map((banner, index) => (
                                <Draggable key={banner.id} draggableId={banner.id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                                        >
                                            <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab active:cursor-grabbing">
                                                <GripVertical className="h-5 w-5" />
                                            </div>

                                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={banner.image_url}
                                                    alt={banner.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{banner.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
                                            </div>

                                            <div className="flex items-center gap-x-2">
                                                <button
                                                    onClick={() => handleToggle(banner.id, banner.is_active)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {banner.is_active ? 'Active' : 'Inactive'}
                                                </button>

                                                <button
                                                    onClick={() => openEditModal(banner)}
                                                    className="p-1 text-gray-400 hover:text-indigo-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">{editingBanner ? 'Edit Banner' : 'New Banner'}</h2>
                        <BannerForm banner={editingBanner} closeModal={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}
