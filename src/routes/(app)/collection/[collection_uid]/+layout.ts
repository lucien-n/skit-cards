import { cfetch } from '$lib/cfetch';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params: { collection_uid }, fetch }) => {
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
