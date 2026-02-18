'use client'

import { useState } from 'react'
import { ErrorBoundary, MinimalErrorFallback } from '@/components/error-boundaries'

function BuggyComponent() {
    const [shouldThrow, setShouldThrow] = useState(false)

    if (shouldThrow) {
        throw new Error('💥 Test error from buggy component!')
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Buggy Component</h3>
            <p className="text-gray-600 mb-4">
                This component will throw an error when you click the button below.
            </p>
            <button
                onClick={() => setShouldThrow(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Trigger Error
            </button>
        </div>
    )
}

export default function TestErrorPage() {
    const [resetKey, setResetKey] = useState(0)

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Error Boundary Test Page
            </h1>
            <p className="text-gray-600 mb-8">
                This page demonstrates how error boundaries catch and handle errors in React components.
            </p>

            <div className="space-y-8">
                {/* Test 1: Component with Error Boundary */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Test 1: Component Protected by Error Boundary
                    </h2>

                    <ErrorBoundary key={resetKey}>
                        <BuggyComponent />
                    </ErrorBoundary>

                    <button
                        onClick={() => setResetKey(prev => prev + 1)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Reset Component
                    </button>
                </div>

                {/* Test 2: Component with Minimal Fallback */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Test 2: Component with Minimal Fallback UI
                    </h2>

                    <ErrorBoundary
                        key={`minimal-${resetKey}`}
                        fallback={
                            <MinimalErrorFallback
                                error={new Error('Custom error message')}
                                resetError={() => setResetKey(prev => prev + 1)}
                            />
                        }
                    >
                        <BuggyComponent />
                    </ErrorBoundary>
                </div>

                {/* Test 3: Async Error Example */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Test 3: Understanding Error Boundaries
                    </h2>

                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            What Error Boundaries Catch:
                        </h3>
                        <ul className="list-disc list-inside text-blue-800 space-y-1">
                            <li>Rendering errors</li>
                            <li>Lifecycle method errors</li>
                            <li>Constructor errors</li>
                        </ul>

                        <h3 className="font-semibold text-blue-900 mt-4 mb-2">
                            What Error Boundaries DON'T Catch:
                        </h3>
                        <ul className="list-disc list-inside text-blue-800 space-y-1">
                            <li>Event handler errors (use try-catch)</li>
                            <li>Async code errors (use try-catch)</li>
                            <li>Server-side rendering errors</li>
                            <li>Errors in the error boundary itself</li>
                        </ul>
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        How to Test:
                    </h3>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                        <li>Click "Trigger Error" in Test 1 to see the default error boundary UI</li>
                        <li>Click "Reset Component" to recover from the error</li>
                        <li>Click "Trigger Error" in Test 2 to see the minimal fallback UI</li>
                        <li>Open browser DevTools console to see error logging</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
