
import { getUsers } from '@/lib/actions/user.actions'
import UserTable from './user-table'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const params = await searchParams
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1
    const search = typeof params.search === 'string' ? params.search : ''
    const role = typeof params.role === 'string' ? params.role : ''
    const status = typeof params.status === 'string' ? params.status : ''

    const { data: users, total, error } = await getUsers({ page, search, role, status })

    if (error) {
        return (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
                Error loading users: {error}
            </div>
        )
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage user accounts, roles, and access.
                    </p>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <UserTable users={users || []} total={total} currentUserId={user.id} />
            </div>
        </div>
    )
}
