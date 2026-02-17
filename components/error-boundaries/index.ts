/**
 * Error Boundary Components
 * 
 * Provides React Error Boundaries for catching and handling
 * client-side JavaScript errors in React component tree
 */

// Main error boundary component
export { ErrorBoundary } from './error-boundary'

// Client-side wrapper
export { ClientErrorBoundary } from './client-error-boundary'

// Fallback UI components
export {
    RouteErrorFallback,
    MinimalErrorFallback
} from './error-fallback'
