import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { signinSchema, signupSchema } from './schema';
import type { PageServerLoad, Actions } from './$types';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session) {
		throw redirect(303, '/');
	}

	return {
		signupForm: superValidate(signupSchema, { id: 'signup-form' }),
		signinForm: superValidate(signupSchema, { id: 'signin-form' })
	};
};

export const actions: Actions = {
	signup: async (event) => {
		const form = await superValidate(event, signupSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const name = form.data.name;
		const email = form.data.email;
		const password = form.data.password;

		const { error } = await event.locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		});

		if (error) {
			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}
	},
	signin: async (event) => {
		const form = await superValidate(event, signinSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const email = form.data.email;
		const password = form.data.password;

		const { error } = await event.locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.'
				});
			}

			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}
	}
};
