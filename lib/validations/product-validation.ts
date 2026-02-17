import { z } from 'zod'

/**
 * Create product schema
 */
export const createProductSchema = z.object({
    name: z
        .string()
        .min(1, 'Product name is required')
        .max(255, 'Product name is too long')
        .trim(),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(5000, 'Description is too long')
        .trim(),
    price: z
        .number()
        .positive('Price must be a positive number')
        .finite('Price must be a valid number'),
    stock_quantity: z
        .number()
        .int('Stock quantity must be an integer')
        .min(0, 'Stock quantity cannot be negative'),
    is_active: z.boolean().default(true),
    benefits: z.array(z.string().trim().min(1)).optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

/**
 * Update product schema (all fields optional except id)
 */
export const updateProductSchema = z.object({
    id: z.string().uuid('Invalid product ID'),
    name: z
        .string()
        .min(1, 'Product name is required')
        .max(255, 'Product name is too long')
        .trim()
        .optional(),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(5000, 'Description is too long')
        .trim()
        .optional(),
    price: z
        .number()
        .positive('Price must be a positive number')
        .finite('Price must be a valid number')
        .optional(),
    stock_quantity: z
        .number()
        .int('Stock quantity must be an integer')
        .min(0, 'Stock quantity cannot be negative')
        .optional(),
    is_active: z.boolean().optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

/**
 * Delete product schema
 */
export const deleteProductSchema = z.object({
    id: z.string().uuid('Invalid product ID'),
})

export type DeleteProductInput = z.infer<typeof deleteProductSchema>
