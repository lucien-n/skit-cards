import { cfetch } from '$lib/cfetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { uid }, fetch }) => {
	const collectionPromise = cfetch<TCollection>(`/api/collections/${uid}`, 'GET', fetch);
	const cardsPromise = cfetch<TFlashcard[]>(`/api/collections/${uid}/cards`, 'GET', fetch);

	return {
		streamed: {
			collectionPromise,
			cardsPromise
		}
	};
};
