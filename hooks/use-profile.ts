
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'

// Create client once outside the component to prevent recreation
const supabase = createClient()

// Global flag to prevent concurrent profile fetches across all instances
let globalIsFetching = false

// ... existing code ...

export function useProfile(initialUser: User | null = null, initialProfile: Profile | null = null) {
    const [profile, setProfile] = useState<Profile | null>(initialProfile)
    // If we have initial data, we are not loading. If we have initialUser but no profile, we might be loading? 
    // Actually if initialUser is null, we are not loading (not logged in).
    // If initialUser is present but initialProfile is null (maybe failed to fetch?), we might try to fetch again? 
    // But for now, let's assume if initialProfile is passed, we are good.
    const [loading, setLoading] = useState(
        // We are loading if we don't have a profile AND we don't know for sure we are logged out (initialUser explicitly null)
        // Check: if initialUser is null, we are not loading. If initialProfile is set, we are not loading.
        // If initialUser is undefined (prop missing), default is null.
        // So:
        !initialProfile && initialUser !== null
    )
    const [error, setError] = useState<string | null>(null)

    // Sync state with props when they change
    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile)
            setLoading(false)
        } else if (initialUser === null) {
            setProfile(null)
            setLoading(false)
        }
    }, [initialProfile, initialUser])

    useEffect(() => {
        let mounted = true

        const getProfile = async () => {
            // Prevent concurrent fetches globally (across all hook instances)
            if (globalIsFetching) {
                console.log('useProfile: Skipping fetch - already in progress globally')
                return
            }

            globalIsFetching = true

            try {
                // Use getSession() instead of getUser() - it's cached locally and faster
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    // Ignore AbortError - this happens when concurrent session access is prevented by Supabase's internal lock
                    if (sessionError.name === 'AbortError' || sessionError.message?.includes('aborted')) {
                        console.log('useProfile: Session read aborted (concurrent access prevented)')
                        return
                    }
                    console.error('useProfile: Session error', sessionError)
                    throw sessionError
                }

                if (!session?.user) {
                    if (mounted) {
                        setProfile(null)
                        setLoading(false)
                    }
                    return
                }

                const { data, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileError) {
                    console.error('useProfile: Profile fetch error', profileError)
                    throw profileError
                }

                if (mounted) {
                    setProfile(data)
                    setError(null)
                }
            } catch (err: any) {
                // Gracefully handle AbortError
                if (err.name === 'AbortError' || err.message?.includes('aborted')) {
                    console.log('useProfile: Request aborted (concurrent access prevented)')
                    return
                }

                console.error('useProfile: Error', err)
                if (mounted) {
                    setProfile(null)
                    setError(err.message || 'Failed to load profile')
                }
            } finally {
                globalIsFetching = false
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        // Initial profile load on mount - SKIP if we have initialProfile
        if (!initialProfile) {
            getProfile()
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                if (mounted) {
                    setProfile(null)
                    setLoading(false)
                }
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                // Don't set loading here - let getProfile control it
                // Only trigger fetch if not already fetching
                if (!globalIsFetching) {
                    await getProfile()
                } else {
                    console.log('useProfile: Auth state change detected but fetch already in progress')
                }
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [initialProfile]) // Re-run if initialProfile changes? No, we handle prop sync in separate effect. But here we use it for checking if we should run getProfile.

    return { profile, loading, error }
}
