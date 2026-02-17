
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/session'

export async function middleware(request: NextRequest) {
    // Generate unique request ID for tracking
    const requestId = crypto.randomUUID()

    // Update session (auth check)
    const response = await updateSession(request)

    // Attach request ID to response headers for client access and logging
    response.headers.set('x-request-id', requestId)

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
