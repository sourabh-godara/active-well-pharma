import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * GET /auth/callback
 *
 * Supabase redirects here after password-reset (or any email-link flow)
 * with a `code` query param. We exchange it for a session, then redirect
 * the user to the `next` query param (e.g. /auth/reset-password).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams, origin } = request.nextUrl
    const code = searchParams.get('code')
    const rawNext = searchParams.get('next') ?? '/'
    
    // Security: Prevent Open Redirect vulnerabilities
    // Ensure the redirect is always a relative path (starts with / but not //)
    const isRelativeUrl = rawNext.startsWith('/') && !rawNext.startsWith('//')
    const next = isRelativeUrl ? rawNext : '/'

    if (!code) {
        return NextResponse.redirect(
            new URL('/auth/login?error=Missing+authorization+code', origin),
        )
    }

    const response = NextResponse.redirect(new URL(next, origin))

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    )
                },
            },
        },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        return NextResponse.redirect(
            new URL('/auth/login?error=Invalid+or+expired+reset+link', origin),
        )
    }

    return response
}
