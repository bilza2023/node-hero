

import { z } from 'zod';

const metaEntrySchema = z.object({
  label:  z.string(),
  end:    z.number(),
  items:  z.array(z.number()),
  images: z.array(z.string()).optional()
});

export const zodMetaV1 = z.object({
  version: z.literal("meta-v1"),
  entries: z.array(metaEntrySchema)
});
