import { cfetch } from '$lib/cfetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url: { origin } }) => {
	const { session } = await parent();

	const url = new URL(`${origin}/api/collections`);

	if (session) url.searchParams.set('which', 'both');

	const collectionsPromise = cfetch<TCollection[]>(url.href, 'GET', fetch);

	return {
		streamed: {
			collectionsPromise
		}
	};
};
