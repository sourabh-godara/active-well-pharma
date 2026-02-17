import { z } from 'zod';

export const insertReviewSchema = z.object({
    productId: z.string().uuid(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
});

export const updateReviewSchema = z.object({
    reviewId: z.string().uuid(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
});

export const insertReplySchema = z.object({
    reviewId: z.string().uuid(),
    replyText: z.string().min(1).max(1000),
});
