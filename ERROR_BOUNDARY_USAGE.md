# Error Boundary Usage Examples

## Quick Start

Error boundaries are now integrated into your app! They will automatically catch client-side errors.

## Usage Examples

### 1. Global Error Boundary (Already Integrated)

The `ClientErrorBoundary` is already wrapped around your entire app in `app/layout.tsx`:

```typescript
<ClientErrorBoundary>
  <UserProvider>
    <CartProvider>
      {/* Your app */}
    </CartProvider>
  </UserProvider>
</ClientErrorBoundary>
```

### 2. Route-Specific Errors

Next.js automatically uses `app/error.tsx` for route-level errors:

```typescript
// app/error.tsx (already created)
export default function Error({ error, reset }) {
  // Handles errors in this route
}
```

### 3. Wrap Specific Components

For critical components, wrap them individually:

```typescript
import { ErrorBoundary } from '@/components/error-boundary'
import { MinimalErrorFallback } from '@/components/error-fallback'

function MyPage() {
  return (
    <ErrorBoundary 
      fallback={<MinimalErrorFallback error={...} resetError={...} />}
    >
      <CriticalComponent />
    </ErrorBoundary>
  )
}
```

### 4. Custom Error Handling

```typescript
import { ErrorBoundary } from '@/components/error-boundary'

function onError(error: Error, errorInfo: ErrorInfo) {
  // Send to monitoring service
  console.log('Custom error handler', error, errorInfo)
}

<ErrorBoundary onError={onError}>
  <MyComponent />
</ErrorBoundary>
```

### 5. Custom Fallback UI

```typescript
import { ErrorBoundary } from '@/components/error-boundary'

const CustomFallback = (
  <div>
    <h1>Oops! Custom error message</h1>
  </div>
)

<ErrorBoundary fallback={CustomFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Testing Error Boundaries

Create a component that throws an error to test:

```typescript
// app/test-error/page.tsx
'use client'

export default function TestError() {
  const throwError = () => {
    throw new Error('Test error boundary!')
  }
  
  return (
    <button onClick={throwError}>
      Throw Error
    </button>
  )
}
```

Visit `/test-error` and click the button to see the error boundary in action!

## Error Fallback Components

### RouteErrorFallback
Full-page error UI for route-level errors:

```typescript
import { RouteErrorFallback } from '@/components/error-fallback'

<ErrorBoundary fallback={<RouteErrorFallback error={error} resetError={reset} />}>
  {children}
</ErrorBoundary>
```

### MinimalErrorFallback
Inline error UI for component-level errors:

```typescript
import { MinimalErrorFallback } from '@/components/error-fallback'

<ErrorBoundary fallback={<MinimalErrorFallback error={error} resetError={reset} />}>
  <SmallComponent />
</ErrorBoundary>
```

## What Errors Are Caught?

✅ **Caught by Error Boundaries:**
- Rendering errors
- Lifecycle method errors
- Constructor errors
- Event handler errors (if they affect rendering)

❌ **NOT Caught by Error Boundaries:**
- Server-side errors (use server action error handling)
- Async errors (use try-catch)
- Event handlers (use try-catch inside handlers)
- Errors in error boundary itself

## Integration with Server Error Handling

Error boundaries complement our server-side error handling:

**Client-side errors** → Error Boundary → Log via `logError()`
**Server-side errors** → Server actions → `handleError()`

Both systems are integrated and use the same logging infrastructure!
