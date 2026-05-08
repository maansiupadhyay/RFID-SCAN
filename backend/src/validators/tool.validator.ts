import { z } from 'zod';

export const createToolSchema = z.object({
  body: z.object({
    toolCode: z.string().min(1, 'Tool code is required').max(50),
    name: z.string().min(1, 'Tool name is required').max(150),
    category: z.string().min(1, 'Category is required').max(100),
    location: z.string().max(200).optional(),
  }),
});

export const updateToolSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(150).optional(),
    category: z.string().min(1).max(100).optional(),
    location: z.string().max(200).optional(),
    status: z.enum(['AVAILABLE', 'ISSUED', 'MISSING']).optional(),
  }),
});
