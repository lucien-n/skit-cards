import { cfetch } from '$lib/cfetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const collectionsPromise: Promise<{ data: TCollection[]; error: string }> = cfetch(
		`/api/collections`,
		'GET',
		fetch
	);

	return {
		streamed: {
			collectionsPromise
		}
	};
};
