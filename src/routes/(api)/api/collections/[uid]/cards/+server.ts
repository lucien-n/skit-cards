import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { uid }, locals: { supabase } }) => {
	if (!uid || uid.length !== 36) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards')
		.select('uid, collection, question, answer')
		.match({ collection: uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (data satisfies TFlashcard[]) return new Response(JSON.stringify({ data }), { status });

	return new Response();
};
