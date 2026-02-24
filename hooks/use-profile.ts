'use client'

/**
 * useProfile — thin re-export of UserContext.
 *
 * All auth / profile fetching logic lives in UserProvider (user-context.tsx).
 * This hook exists purely for backward-compatibility with components that
 * import from '@/hooks/use-profile'.
 */
import { useUser } from '@/app/context/user-context'

export function useProfile() {
    return useUser()
}
