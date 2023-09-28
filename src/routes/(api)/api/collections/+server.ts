import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) return new Response(null, { status: 401 });

	const query = supabase
		.from('cards_collections')
		.select('uid, author, name, is_public, created_at')
		.match({ author: session.user.id });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (data satisfies TCollection[]) return new Response(JSON.stringify({ data }), { status });

	return new Response(null, { status });
};
