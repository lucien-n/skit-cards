import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { collection_uid }, locals: { supabase } }) => {
	if (!collection_uid || collection_uid.length !== 21) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards_collections')
		.select('uid, author:profiles(name:name, uid:uid), name, is_public, created_at')
		.match({ uid: collection_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	return new Response(
		JSON.stringify({
			data: {
				...data,
				author: {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					uid: data.author.uid,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					name: data.author.name
				}
			}
		}),
		{ status }
	);
};
