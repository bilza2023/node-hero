import { z } from 'zod';
import { zodDeckV1 } from './ZodDeckV1';

export const questionSchema = z.object({
filename: z.string().regex(/^\[a-z0-9\_-]+\$/, "Invalid slug format"),
deck: zodDeckV1,

name: z.string(),
description: z.string(),
tags: z.array(z.string()),
status: z.enum(['draft', 'ready', 'published', 'archived']),
createdAt: z.string().datetime(),
editedAt: z.string().datetime()
});
