import { collectionSchema } from '$lib/schemas/collection_schema';
import { getExpiration } from '$server/cache';
import { redis } from '$server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { ZodError } from 'zod';

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
		.from('collections')
		.select('uid, name, is_public, author:profiles(name:name), created_at')
		.match(match)
		.range(offset, limit + offset);

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const collections: TCollection[] = [];

	for (const collectionData of data) {
		collections.push({
			...collectionData,
			author: collectionData.author?.name || 'Unknown'
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

	const id = nanoid();

	const collection = {
		uid: id,
		author: session.user.id,
		name,
		is_public
	};

	try {
		collectionSchema.parse({ name, isPublic: is_public });
	} catch (e: unknown) {
		const error = e as ZodError;
		if (error.errors[0]?.message)
			return new Response(JSON.stringify({ error: error.errors[0].message }), { status: 422 });
	}

	const query = supabase.from('collections').insert(collection).select('uid, created_at');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const { uid, created_at } = data[0];

	const redisKey = `collection:${id}`;
	redis.set(
		redisKey,
		JSON.stringify({ ...collection, created_at }),
		'EX',
		getExpiration('collection')
	);

	return new Response(JSON.stringify({ data: uid }), { status });
};
