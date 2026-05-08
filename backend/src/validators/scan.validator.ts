import { z } from 'zod';

export const scanSchema = z.object({
  body: z.object({
    scannedIds: z
      .array(z.string().min(1))
      .min(1, 'At least one scanned ID is required')
      .max(1000, 'Maximum 1000 IDs per scan'),
  }),
});
