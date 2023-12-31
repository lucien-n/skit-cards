import { cfetch } from '$lib/cfetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params: { collection_uid } }) => {
	const collectionPromise = cfetch<TCollection>(`/api/collections/${collection_uid}`, 'GET', fetch);
	const cardsPromise = cfetch<TFlashcard[]>(
		`/api/collections/${collection_uid}/cards`,
		'GET',
		fetch
	);

	return {
		streamed: {
			collectionPromise,
			cardsPromise
		}
	};
};
