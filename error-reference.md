# Error Handling Infrastructure - Quick Reference Guide

> **Export to PDF:** Open this file in VS Code or a browser and use "Print to PDF" or use Pandoc: `pandoc error-reference.md -o error-reference.pdf`

---

## 📋 Table of Contents

1. [Error Codes](#error-codes)
2. [Custom Error Classes](#custom-error-classes)
3. [Error Handler](#error-handler)
4. [Validation Utilities](#validation-utilities)
5. [Request Context](#request-context)
6. [Usage Examples](#usage-examples)

---

## 1. Error Codes

### File: `lib/errors/error-codes.ts`

```typescript
export enum ErrorCode {
  // Validation errors (1000-1999)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  
  // Database errors (2000-2999)
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Auth errors (3000-3999)
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  
  // Resource errors (4000-4999)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  
  // Server errors (5000-5999)
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
}
```

**📌 One-Line Solution:**
```typescript
import { ErrorCode } from '@/lib/errors'
```

---

## 2. Custom Error Classes

### File: `lib/errors/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message)
    this.statusCode = ErrorStatusMap[code]
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.VALIDATION_ERROR, true, details)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code = ErrorCode.DATABASE_ERROR, details?: any) {
    super(message, code, true, details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', code = ErrorCode.AUTHENTICATION_ERROR, details?: any) {
    super(message, code, true, details)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions', code = ErrorCode.AUTHORIZATION_ERROR, details?: any) {
    super(message, code, true, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, ErrorCode.RESOURCE_NOT_FOUND, true, details)
  }
}

export class UnknownError extends AppError {
  constructor(message = 'An unexpected error occurred', details?: any) {
    super(message, ErrorCode.UNKNOWN_ERROR, false, details)
  }
}
```

**📌 One-Line Solutions:**
```typescript
// Validation error
throw new ValidationError('Invalid email format', { field: 'email' })

// Database error
throw new DatabaseError('Product not found', ErrorCode.RECORD_NOT_FOUND)

// Auth error
throw new AuthenticationError('Invalid credentials', ErrorCode.INVALID_CREDENTIALS)

// Not found error
throw new NotFoundError('User not found')

// Unknown error (non-operational)
throw new UnknownError('Unexpected system error')
```

---

## 3. Error Handler

### File: `lib/errors/error-handler.ts`

```typescript
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    requestId?: string
    stack?: string  // Dev only
  }
}

export function handleError(error: unknown, requestId?: string): ErrorResponse {
  const finalRequestId = requestId || getRequestId()
  const appError = classifyError(error)
  logError(appError, finalRequestId)
  return sanitizeError(appError, finalRequestId)
}

export function sanitizeError(error: AppError, requestId?: string): ErrorResponse {
  // Non-operational errors → generic message
  if (!error.isOperational) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        requestId,
      }
    }
  }
  
  // Development: show details + stack
  // Production: hide internals
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: isDevelopment() ? error.details : undefined,
      requestId,
      stack: isDevelopment() ? error.stack : undefined,
    }
  }
}
```

**📌 One-Line Solutions:**
```typescript
// In server actions - wrap entire function
export async function myAction() {
  try {
    // ... your logic
  } catch (error) {
    return handleError(error)
  }
}

// Create success response
return createSuccessResponse({ data: result }, 'Operation successful')

// Manual error handling
return handleError(new ValidationError('Invalid input'))
```

---

## 4. Validation Utilities

### File: `lib/errors/validation-utils.ts`

```typescript
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw handleZodError(error)
    }
    throw error
  }
}

export function handleZodError(error: z.ZodError): ValidationError {
  const formattedErrors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }))
  
  const message = formattedErrors[0] 
    ? `${formattedErrors[0].field}: ${formattedErrors[0].message}`
    : 'Validation failed'
    
  return new ValidationError(message, { errors: formattedErrors })
}
```

**📌 One-Line Solutions:**
```typescript
// Validate and throw on error
const validData = validateWithSchema(loginSchema, rawData)

// Safe validation (doesn't throw)
const result = safeValidateWithSchema(loginSchema, rawData)
if (!result.success) return handleError(result.error)
```

---

## 5. Request Context

### File: `lib/errors/request-context.ts`

```typescript
import { AsyncLocalStorage } from 'async_hooks'

export const requestContext = new AsyncLocalStorage<{ requestId: string }>()

export function generateRequestId(): string {
  return crypto.randomUUID()
}

export function getRequestId(): string | undefined {
  return requestContext.getStore()?.requestId
}

export async function withRequestId<T>(fn: () => Promise<T>): Promise<T> {
  const requestId = generateRequestId()
  return requestContext.run({ requestId }, fn)
}
```

**📌 One-Line Solutions:**
```typescript
// Get current request ID
const reqId = getRequestId()

// Wrap async function with request context
await withRequestId(async () => { /* your code */ })

// Middleware: attach to headers
response.headers.set('x-request-id', crypto.randomUUID())
```

---

## 6. Usage Examples

### 🔹 Basic Server Action Pattern

```typescript
'use server'
import { handleError, validateWithSchema, type ActionResponse } from '@/lib/errors'
import { mySchema } from '@/lib/validations/my-validation'

export async function myAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    // 1. Validate input
    const data = validateWithSchema(mySchema, {
      field: formData.get('field') as string,
    })
    
    // 2. Your business logic
    const result = await doSomething(data)
    
    // 3. Return success
    return { success: true, data: result }
  } catch (error) {
    // 4. Centralized error handling
    return handleError(error)
  }
}
```

**📌 One-Line:** `try { /* logic */ } catch (error) { return handleError(error) }`

---

### 🔹 Validation Schema Example

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
})
```

**📌 One-Line:** `const data = validateWithSchema(loginSchema, rawData)`

---

### 🔹 Throwing Specific Errors

```typescript
// Validation error
if (!isValid) throw new ValidationError('Invalid format')

// Database error
if (!product) throw new DatabaseError('Not found', ErrorCode.RECORD_NOT_FOUND)

// Auth error
if (!user) throw new AuthenticationError('Not authenticated', ErrorCode.USER_NOT_AUTHENTICATED)

// Payment error
if (paymentFailed) throw new DatabaseError('Payment failed', ErrorCode.PAYMENT_ERROR)
```

**📌 One-Line:** `if (!condition) throw new [ErrorType]('message', ErrorCode.[CODE])`

---

### 🔹 Middleware Pattern

```typescript
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const response = await updateSession(request)
  response.headers.set('x-request-id', requestId)
  return response
}
```

**📌 One-Line:** `response.headers.set('x-request-id', crypto.randomUUID())`

---

### 🔹 Error Response Format

```typescript
// Success response
{
  success: true,
  data: { ... },
  message: "Optional success message"
}

// Error response (Development)
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "email: Invalid email format",
    details: { errors: [...] },
    requestId: "550e8400-e29b-41d4-a716-446655440000",
    stack: "Error: ..." // Dev only
  }
}

// Error response (Production)
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "email: Invalid email format",
    requestId: "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**📌 One-Line Check:** `if (!response.success) { /* handle error */ }`

---

## 🎯 Quick Import Cheatsheet

```typescript
// Everything you need in one import
import {
  // Error classes
  AppError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  UnknownError,
  
  // Error codes
  ErrorCode,
  
  // Error handler
  handleError,
  createSuccessResponse,
  
  // Validation
  validateWithSchema,
  safeValidateWithSchema,
  
  // Request context
  getRequestId,
  withRequestId,
  
  // Types
  type ErrorResponse,
  type ActionResponse,
} from '@/lib/errors'
```

---

## ⚡ Common Patterns

### Pattern 1: Form Action with Validation
```typescript
export async function submitForm(prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const data = validateWithSchema(formSchema, { /* extract fields */ })
    const result = await processData(data)
    return { success: true, data: result }
  } catch (error) {
    return handleError(error)
  }
}
```

### Pattern 2: Database Operation
```typescript
const { data, error } = await supabase.from('table').insert(record)
if (error) throw new DatabaseError(error.message, ErrorCode.DATABASE_ERROR)
```

### Pattern 3: Authentication Check
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new AuthenticationError('Not authenticated', ErrorCode.USER_NOT_AUTHENTICATED)
```

### Pattern 4: Not Found Check
```typescript
if (!resource) throw new NotFoundError('Resource not found')
```

---

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development  # Shows stack traces and details
NODE_ENV=production   # Hides internals
```

### Middleware Setup
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const response = await updateSession(request)
  response.headers.set('x-request-id', requestId)
  return response
}
```

---

## 📊 Error Code Reference Table

| Code | HTTP Status | Use Case |
|------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Invalid input format |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `USER_NOT_AUTHENTICATED` | 401 | No active session |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `RECORD_NOT_FOUND` | 404 | Resource doesn't exist |
| `DUPLICATE_ENTRY` | 409 | Unique constraint violation |
| `DATABASE_ERROR` | 500 | General DB error |
| `PAYMENT_ERROR` | 500 | Payment processing failed |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected system error |

---

## 🚀 Best Practices

1. **Always use try-catch in server actions**
   ```typescript
   try { /* logic */ } catch (error) { return handleError(error) }
   ```

2. **Validate input first**
   ```typescript
   const data = validateWithSchema(schema, rawInput)
   ```

3. **Use specific error types**
   ```typescript
   throw new ValidationError(msg)  // Not generic Error
   ```

4. **Include request IDs in logs**
   ```typescript
   console.log(`[${getRequestId()}] Processing...`)
   ```

5. **Return consistent responses**
   ```typescript
   return { success: true/false, ... }
   ```

---

## 📝 Summary

**Total Files:** 7 core files + 2 validation schemas

**Import Everything:**
```typescript
import { handleError, validateWithSchema, ErrorCode, type ActionResponse } from '@/lib/errors'
```

**Basic Pattern:**
```typescript
try {
  const data = validateWithSchema(schema, input)
  const result = await doSomething(data)
  return { success: true, data: result }
} catch (error) {
  return handleError(error)
}
```

**That's it!** 🎉

---

*Generated: 2026-02-17 | Active Well Pharma Error Handling System*
