import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { collection_uid }, locals: { supabase } }) => {
	if (!collection_uid || collection_uid.length !== 21) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards_collections')
		.select('uid, author, name, is_public, created_at')
		.match({ uid: collection_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (data[0] satisfies TCollection)
		return new Response(JSON.stringify({ data: data[0] }), { status });

	return new Response(null, { status });
};
