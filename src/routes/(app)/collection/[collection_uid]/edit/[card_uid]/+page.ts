import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { uid } }) => {
	if (uid === 'new') return { mode: 'new' };
	return { mode: 'edit', uid };
};
