import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { cfetch } from '$lib/cfetch';

export const load: PageServerLoad = async ({ fetch, params: { name } }) => {
	if (name.length < 3 || name.length > 255) throw redirect(303, '/');

	const profilePromise = cfetch(`/api/users/${name}/profile`, 'GET', fetch);

	return {
		streamed: { profilePromise }
	};
};
