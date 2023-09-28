import { z } from 'zod';

export const collectionSchema = z.object({
	name: z.string().min(3).max(80).default('New Collection'),
	is_public: z.boolean().default(true)
});

export type CollectionSchema = typeof collectionSchema;
