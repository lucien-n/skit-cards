import { cfetch } from '$lib/cfetch';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { collectionSchema } from './collection_schema';

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(collectionSchema)
	};
};

export const actions: Actions = {
	'create-collection': async (event) => {
		const {
			fetch,
			locals: { getSession }
		} = event;

		const form = await superValidate(event, collectionSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await getSession();
		if (!session) return fail(401, { error: 'You must be signed in', form });

		const name = form.data.name;
		const is_public = form.data.is_public;

		const {
			data: uid,
			error,
			status
		} = await cfetch<string>(`/api/collections`, 'POST', fetch, {
			body: JSON.stringify({ name, is_public }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (error)
			fail(status, {
				error
			});

		if (status === 422)
			return fail(422, {
				error: "Server couldn't process this collection"
			});

		if (status == 409)
			return fail(409, {
				error: `A collection with the name ${name} already exists`
			});

		if (!uid) return fail(status, { error: 'Error during collection creation. Try again later' });

		return {
			uid,
			form
		};
	}
};
