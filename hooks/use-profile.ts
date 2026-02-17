
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

// Create client once outside the component to prevent recreation
const supabase = createClient()

// Global flag to prevent concurrent profile fetches across all instances
let globalIsFetching = false

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

        // Initial profile load on mount
        getProfile()

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
    }, [])

    return { profile, loading, error }
}
