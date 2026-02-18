'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logError } from '@/lib/errors/error-handler.client'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Check if this is a Next.js internal error (redirect or not-found)
        // These are not actual errors but control flow mechanisms
        const isNextJsError =
            error &&
            typeof error === 'object' &&
            'digest' in error &&
            typeof (error as any).digest === 'string' &&
            ((error as any).digest.startsWith('NEXT_REDIRECT') || (error as any).digest.startsWith('NEXT_NOT_FOUND'))

        // Don't log Next.js internal errors
        if (isNextJsError) {
            // Rethrow so Next.js can handle the redirect/not-found
            throw error
        }

        // Log the error to our error logging system
        console.error('Error Boundary caught an error:', error, errorInfo)

        // Use our centralized error logging
        logError(error)

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // In production, you could also send to error monitoring service
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
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
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 text-center mb-6">
                            We're sorry, but something unexpected happened. Please try again.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
                                <p className="text-sm font-mono text-red-600 break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={this.resetError}
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

        return this.props.children
    }
}
