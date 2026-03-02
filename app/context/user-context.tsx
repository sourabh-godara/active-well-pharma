// app/context/user-context.tsx
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

    // Start loading=true whenever we have no profile yet — covers both:
    //   a) server-seeded user with no profile (original behaviour)
    //   b) no seed at all — we must wait for INITIAL_SESSION to resolve
    const [loading, setLoading] = useState(initialProfile === null)

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

                if (error?.name === 'AbortError') return
                if (!mounted) return

                setProfile(error ? null : data)
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return
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

            // INITIAL_SESSION fires on page load with the current session.
            // SIGNED_IN fires after login. TOKEN_REFRESHED / USER_UPDATED
            // fire on token rotation and profile updates respectively.
            if (
                event === 'INITIAL_SESSION' ||
                event === 'SIGNED_IN' ||
                event === 'USER_UPDATED' ||
                event === 'TOKEN_REFRESHED'
            ) {
                // No session means logged-out user — clear state and stop loading
                if (!session?.user) {
                    userRef.current = null
                    setUser(null)
                    setProfile(null)
                    setLoading(false)
                    return
                }

                // Dedup guard — skip if same user (e.g. token refresh)
                if (session.user.id === userRef.current?.id && profile !== null) return

                setLoading(true)

                // getUser() validates the token server-side
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
                if (debounceRef.current) clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(() => {
                    handleAuthChange(event, session)
                }, 50)
            },
        )

        // ── If server-seeded user exists but no profile, fetch it once ───────
        if (initialUser && !initialProfile) {
            fetchProfile(initialUser.id)
        }

        return () => {
            mounted = false
            if (debounceRef.current) clearTimeout(debounceRef.current)
            subscription.unsubscribe()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
