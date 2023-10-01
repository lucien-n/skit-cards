import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { collectionSchema } from '$lib/schemas/collection_schema';
import { superValidate } from 'sveltekit-superforms/server';
import { cfetch } from '$lib/cfetch';

export const load: PageServerLoad = async ({ url: { searchParams } }) => {
	const form = await superValidate(collectionSchema);

	const isPublic = searchParams.get('is_public') === 'true';
	const name = searchParams.get('name');

	form.data.isPublic = isPublic;
	if (name) form.data.name = name;

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
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

		const { error, status } = await cfetch<null>(
			`/api/collections/${collection_uid}`,
			'PUT',
			fetch,
			{ body: JSON.stringify({ isPublic, name }), headers: { 'Content-Type': 'application/json' } }
		);

		if (error)
			fail(status, {
				error
			});
	}
};
