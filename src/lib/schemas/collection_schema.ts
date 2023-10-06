import { z } from 'zod';

export const collectionSchema = z.object({
	name: z.string().min(3).max(80),
	isPublic: z.boolean().default(false),
	color: z.string().length(7).default('#000000')
});

export type CollectionSchema = typeof collectionSchema;
