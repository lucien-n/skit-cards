import { cfetch } from '$lib/cfetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const collectionsPromise = cfetch<TCollection[]>(`/api/collections`, 'GET', fetch);

	return {
		streamed: {
			collectionsPromise
		}
	};
};
