'use client'

import { createContext, useContext } from 'react'
import { useProfile } from '@/hooks/use-profile'
import { Profile } from '@/types'

interface UserContextType {
    profile: Profile | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
    isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { profile, loading, error } = useProfile()

    const isAuthenticated = !!profile
    const isAdmin = profile?.role === 'admin'

    return (
        <UserContext.Provider value={{
            profile,
            loading,
            error,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
