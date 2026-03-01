// lib/supabase/session.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JwtCustomClaims {
    user_role?: string
    is_blocked?: boolean
    sub?: string
    exp?: number
}

function decodeSessionClaims(accessToken: string): JwtCustomClaims {
    try {
        return jwtDecode<JwtCustomClaims>(accessToken)
    } catch {
        return {}
    }
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({ request: { headers: request.headers } })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Single cookie-based session read — zero DB round-trips
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null

    // Decode JWT custom claims — populated by custom_access_token_hook
    const claims: JwtCustomClaims = session?.access_token
        ? decodeSessionClaims(session.access_token)
        : {}

    const { pathname } = request.nextUrl
    const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')
    const isAdminPage = pathname.startsWith('/admin')
    const isDashboardPage = pathname.startsWith('/dashboard')

    // Redirect authenticated users away from auth pages
    if (user !== null && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect unauthenticated users away from protected pages
    if (user === null && (isDashboardPage || isAdminPage)) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Admin role check via JWT claim — no DB query
    if (isAdminPage && claims.user_role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Blocked user check via JWT claim — no DB query
    if (user !== null && claims.is_blocked === true) {
        await supabase.auth.signOut()
        return NextResponse.redirect(
            new URL('/auth/login?error=Your account is blocked', request.url)
        )
    }

    return response
}
