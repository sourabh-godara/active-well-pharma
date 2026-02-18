'use client'

import React, { ReactNode } from 'react'
import { ErrorBoundary } from './error-boundary'

interface ClientErrorBoundaryProps {
    children: ReactNode
}

/**
 * Client-side error boundary wrapper
 * Use this to wrap parts of your app that need error boundary protection
 */
export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    )
}
