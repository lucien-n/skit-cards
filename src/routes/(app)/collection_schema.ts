import { z } from 'zod';

export const collectionSchema = z.object({
	name: z.string().min(3).max(80),
	is_public: z.boolean().default(false)
});

export type CollectionSchema = typeof collectionSchema;
