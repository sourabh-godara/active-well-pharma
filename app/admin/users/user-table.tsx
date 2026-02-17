
'use client'

import { useState } from 'react'
import { Profile } from '@/types'
import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import UserActions from './user-actions'

interface UserTableProps {
    users: Profile[]
    total: number
    currentUserId: string
}

export default function UserTable({ users, total, currentUserId }: UserTableProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative max-w-sm w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        defaultValue={searchParams.get('search')?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        defaultValue={searchParams.get('role')?.toString() || 'all'}
                        onChange={(e) => handleFilter('role', e.target.value)}
                        className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        defaultValue={searchParams.get('status')?.toString() || 'all'}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="block rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                                                <div className="text-gray-500">{user.email || 'No Email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 ring-purple-700/10'
                                                : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.is_blocked
                                                ? 'bg-red-50 text-red-700 ring-red-600/10'
                                                : 'bg-green-50 text-green-700 ring-green-600/20'
                                            }`}>
                                            {user.is_blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <UserActions user={user} currentUserId={currentUserId} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                                    No users found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
