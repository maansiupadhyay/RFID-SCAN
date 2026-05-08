import { z } from 'zod';

export const issueToolSchema = z.object({
  body: z.object({
    toolCode: z.string().min(1, 'Tool code is required'),
    issuedTo: z.string().min(1, 'Issued to field is required').max(150),
    remarks: z.string().max(500).optional(),
  }),
});

export const returnToolSchema = z.object({
  body: z.object({
    toolCode: z.string().min(1, 'Tool code is required'),
    remarks: z.string().max(500).optional(),
  }),
});
