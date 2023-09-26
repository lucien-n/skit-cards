import { z } from 'zod';

export const signupSchema = z.object({
	name: z
		.string()
		.min(2, 'Your name must be atleast 2 characters long')
		.max(36, 'Your name cannot be greater than 36 character'),
	email: z.string().email('Please enter a valid email'),
	password: z
		.string()
		.min(8, 'Your password must be atleast 8 characters long')
		.max(255, 'Your password cannot be greater than 255 characters')
});

export type SignupSchema = typeof signupSchema;

export const signinSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z
		.string()
		.min(8, 'Your password must be atleast 8 characters long')
		.max(255, 'Your password cannot be greater than 255 characters')
});

export type SigninSchema = typeof signinSchema;
