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

export const POST: RequestHandler = async ({
	request: { body, bodyUsed, json },
	locals: { supabase, getSession }
}) => {
	if (!bodyUsed || !body) return new Response(null, { status: 422 });

	const { name, is_public } = await json();

	console.log(name, is_public);

	const session = await getSession();

	if (!session) return new Response(null, { status: 401 });

	const query = supabase
		.from('cards-collections')
		.insert({ author: session.user.id, name, is_public })
		.select('uid');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const uid = data[0].uid;

	console.log('new collection:', uid);

	return new Response(JSON.stringify({ data: uid }), { status });
};
