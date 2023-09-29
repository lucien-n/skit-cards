import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({
	url: { searchParams },
	locals: { supabase, getSession }
}) => {
	const limit = 10;
	const offset = 0;

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
		.select('uid, name, is_public, author:profiles(name:name, uid:uid), created_at')
		.match(match)
		.range(offset, limit + offset);

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const collections: TCollection[] = [];

	for (const collectionData of data) {
		collections.push({
			...collectionData,
			author: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				uid: collectionData.author.uid,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				name: collectionData.author.name
			}
		});
	}

	return new Response(JSON.stringify({ data: collections }), { status });
};

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
	const { name, is_public } = await request.json();

	const session = await getSession();
	if (!session) return new Response(null, { status: 401 });

	const { data: exists } = await supabase.rpc('collection_exists_by_author', {
		author_uid: session.user.id,
		collection_name: name
	});

	if (exists) return new Response(JSON.stringify({ data: { name } }), { status: 409 });

	const query = supabase
		.from('cards_collections')
		.insert({ author: session.user.id, name, is_public })
		.select('uid');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const uid = data[0].uid;

	return new Response(JSON.stringify({ data: uid }), { status });
};
