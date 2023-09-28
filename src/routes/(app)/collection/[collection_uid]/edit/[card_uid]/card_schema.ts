import { z } from 'zod';

export const cardSchema = z.object({
	question: z.string().default(''),
	answer: z.string().default('')
});

export type CardSchema = typeof cardSchema;
