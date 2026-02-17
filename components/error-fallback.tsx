'use client'

import React from 'react'
import { Home, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
    error: Error
    resetError: () => void
}

/**
 * Simple error fallback UI for route-specific errors
 */
export function RouteErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Oops! Something went wrong
                </h2>
                <p className="text-gray-600 mb-8">
                    An error occurred while loading this page. Please try again.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-gray-100 rounded text-left">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Error Details:</p>
                        <p className="text-sm font-mono text-red-600 break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={resetError}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    )
}

/**
 * Minimal error fallback for non-critical sections
 */
export function MinimalErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
                <svg
                    className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
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
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Error loading content
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                        {process.env.NODE_ENV === 'development'
                            ? error.message
                            : 'Something went wrong. Please try again.'}
                    </p>
                    <button
                        onClick={resetError}
                        className="text-sm font-medium text-red-600 hover:text-red-700 underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    )
}
