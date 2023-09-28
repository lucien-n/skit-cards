import { z } from 'zod';

export const cardSchema = z.object({
	question: z.string(),
	answer: z.string()
});

export type CardSchema = typeof cardSchema;
