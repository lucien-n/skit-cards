import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({
	url: { searchParams },
	locals: { supabase, getSession }
}) => {
	type Mode = 'public' | 'self' | 'both' | null;
	const which: Mode = searchParams.get('which') as Mode;

	let match: object;
	if (which === 'self') {
		const session = await getSession();
		if (!session) return new Response(null, { status: 401 });
		match = { author: session.user.id };
	} else if (which === 'public') {
		match = { is_public: true };
	} else {
		match = {};
	}

	const query = supabase
		.from('cards_collections')
		.select('uid, author, name, is_public, created_at')
		.match(match);

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (data satisfies TCollection[]) return new Response(JSON.stringify({ data }), { status });

	return new Response(null, { status });
};

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { name, is_public } = await request.json();

	const session = await getSession();

	if (!session) return new Response(null, { status: 401 });

	const query = supabase
		.from('cards_collections')
		.insert({ author: session.user.id, name, is_public })
		.select('uid');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const { uid } = data[0].uid;

	return new Response(JSON.stringify({ data: uid }), { status });
};
