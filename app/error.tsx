'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/errors'

/**
 * Next.js Error Component
 * This file is automatically used by Next.js to handle errors in your application
 * It must be a Client Component
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to our error logging system
        logError(error)

        // In production, you might want to send to error monitoring
        // Example: Sentry.captureException(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-gray-100">
            <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Something went wrong!
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    We encountered an error while processing your request. Please try again.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Error Details:</p>
                        <p className="text-sm font-mono text-red-600 break-all mb-2">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    )
}
