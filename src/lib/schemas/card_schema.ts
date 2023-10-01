import { z } from 'zod';

export const cardSchema = z.object({
	question: z.string().min(3).max(80).default(''),
	answer: z.string().min(3).max(80).default('')
});

export type CardSchema = typeof cardSchema;
