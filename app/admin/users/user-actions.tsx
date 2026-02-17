
'use client'

import { useState } from 'react'
import { Profile } from '@/types'
import { toggleUserBlock, toggleUserRole, deleteUser } from '@/lib/actions/user.actions'
import { Ban, Shield, Trash2, ShieldAlert, CheckCircle, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { useTransition } from 'react'

interface UserActionsProps {
    user: Profile
    currentUserId: string
}

export default function UserActions({ user, currentUserId }: UserActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const isSelf = user.id === currentUserId

    const handleBlock = () => {
        if (isSelf) return
        startTransition(async () => {
            try {
                await toggleUserBlock(user.id, !user.is_blocked)
                toast.success(user.is_blocked ? 'User unblocked' : 'User blocked')
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }

    const handleRoleChange = () => {
        if (isSelf) return
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        startTransition(async () => {
            try {
                await toggleUserRole(user.id, newRole)
                toast.success(`User role updated to ${newRole}`)
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }

    const handleDelete = async () => {
        if (isSelf) return
        startTransition(async () => {
            try {
                await deleteUser(user.id)
                toast.success('User deleted')
                setShowDeleteConfirm(false)
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }

    if (isSelf) return <span className="text-xs text-gray-400 italic">Current User</span>

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleRoleChange}
                disabled={isPending}
                title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                className={`p-1 rounded-full transition-colors ${user.role === 'admin'
                        ? 'text-indigo-600 hover:bg-indigo-50'
                        : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
            >
                <Shield className="h-4 w-4" />
            </button>

            <button
                onClick={handleBlock}
                disabled={isPending}
                title={user.is_blocked ? "Unblock User" : "Block User"}
                className={`p-1 rounded-full transition-colors ${user.is_blocked
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                    }`}
            >
                {user.is_blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            </button>

            <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isPending}
                title="Delete User"
                className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <ShieldAlert className="h-6 w-6" />
                            <h3 className="text-lg font-bold">Delete User?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{user.full_name || user.email}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                {isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
