'use client'

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    isAdmin: boolean
    isBlocked: boolean
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<AuthContextType | undefined>(undefined)

// Singleton Supabase client — created once for the entire browser session
const supabase = createClient()

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({
    children,
    initialUser = null,
    initialProfile = null,
}: {
    children: React.ReactNode
    initialUser?: User | null
    initialProfile?: Profile | null
}) {
    const [user, setUser] = useState<User | null>(initialUser)
    const [profile, setProfile] = useState<Profile | null>(initialProfile)

    // If we have initialProfile there is nothing to load; if we have a user
    // but no profile we may need to fetch one, so start in loading state.
    const [loading, setLoading] = useState(!initialProfile && initialUser !== null)

    // Refs used inside the effect closure so we never capture stale state
    const userRef = useRef<User | null>(initialUser)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        let mounted = true

        // ── Fetch profile from DB for a given user ──────────────────────────
        const fetchProfile = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                // 1. Silent AbortError guard — network cancellation is harmless
                if (error?.name === 'AbortError') return

                if (!mounted) return

                setProfile(error ? null : data)
            } catch (err: any) {
                if (err?.name === 'AbortError') return
            } finally {
                if (mounted) setLoading(false)
            }
        }

        // ── Handler called (debounced) on every auth state change ───────────
        const handleAuthChange = async (
            event: string,
            session: { user: User } | null,
        ) => {
            if (!mounted) return

            if (event === 'SIGNED_OUT') {
                userRef.current = null
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
                // 2. Dedup guard — skip if it's the same user (e.g. token refresh)
                if (session?.user?.id && session.user.id === userRef.current?.id) return

                setLoading(true)

                // Use getUser() — does NOT acquire the lock that triggers AbortError
                const { data: { user: freshUser }, error } = await supabase.auth.getUser()

                if (error?.name === 'AbortError' || !mounted) return

                if (!freshUser) {
                    userRef.current = null
                    setUser(null)
                    setProfile(null)
                    setLoading(false)
                    return
                }

                userRef.current = freshUser
                setUser(freshUser)
                await fetchProfile(freshUser.id)
            }
        }

        // ── Subscribe to auth changes with 50ms debounce ────────────────────
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Clear any pending debounce before scheduling a new one
                if (debounceRef.current) clearTimeout(debounceRef.current)

                debounceRef.current = setTimeout(() => {
                    handleAuthChange(event, session)
                }, 50)
            }
        )

        // ── If no initialProfile but we have a user, fetch profile once ──────
        if (!initialProfile && initialUser) {
            fetchProfile(initialUser.id)
        }

        // ── Cleanup: cancel debounce timer + unsubscribe ─────────────────────
        return () => {
            mounted = false
            if (debounceRef.current) clearTimeout(debounceRef.current)
            subscription.unsubscribe()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    // Empty deps: we use refs for mutable values and only subscribe once.

    return (
        <UserContext.Provider
            value={{
                user,
                profile,
                loading,
                isAdmin: profile?.role === 'admin',
                isBlocked: profile?.is_blocked ?? false,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useUser = (): AuthContextType => {
    const ctx = useContext(UserContext)
    if (ctx === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return ctx
}
