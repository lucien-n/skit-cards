import { cfetch } from '$lib/cfetch';
import { collectionSchema } from '$lib/schemas/collection_schema';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url: { searchParams } }) => {
	const form = await superValidate(collectionSchema);

	const isPublic = searchParams.get('is_public') === 'true';
	const name = searchParams.get('name');
	const color = searchParams.get('color');

	form.data.isPublic = isPublic;
	if (name) form.data.name = name;
	if (color) form.data.color = color;

	return {
		form
	};
};

export const actions: Actions = {
	update: async (event) => {
		const {
			fetch,
			params: { collection_uid },
			locals: { getSession }
		} = event;
		if (!collection_uid || collection_uid.length !== 21) return;

		const form = await superValidate(event, collectionSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await getSession();
		if (!session) return fail(401, { error: 'You must be signed in', form });

		const isPublic = form.data.isPublic;
		const name = form.data.name;
		const color = form.data.color;

		const { error, status } = await cfetch<null>(
			`/api/collections/${collection_uid}`,
			'PUT',
			fetch,
			{
				body: JSON.stringify({ isPublic, name, color }),
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (error)
			fail(status, {
				error
			});
	},
	delete: async ({ fetch, params: { collection_uid } }) => {
		const { error, status } = await cfetch<null>(
			`/api/collections/${collection_uid}`,
			'DELETE',
			fetch
		);

		if (error)
			fail(status, {
				error
			});
	}
};
