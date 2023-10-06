import { collectionSchema } from '$lib/schemas/collection_schema';
import { getExpiration, getHeaders } from '$server/cache';
import { checkUid } from '$server/helper';
import { redis } from '$server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import type { ZodError } from 'zod';

export const GET: RequestHandler = async ({
	setHeaders,
	params: { collection_uid },
	locals: { supabase }
}) => {
	if (!collection_uid || collection_uid.length !== 21) return new Response(null, { status: 422 });

	const redisKey = 'collection:' + collection_uid;
	const cached = await redis.get(redisKey);

	if (cached && (JSON.parse(cached) satisfies TCollection)) {
		const ttl = await redis.ttl(redisKey);
		setHeaders({ 'Cache-Control': `max-age=${ttl}` });
		return new Response(JSON.stringify({ data: JSON.parse(cached) }), { status: 200 });
	}

	const query = supabase
		.from('collections')
		.select('uid, author:profiles(name:name), name, is_public, color, created_at')
		.match({ uid: collection_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (!data[0].author)
		return new Response(JSON.stringify({ error: 'Could not find author' }), { status: 404 });

	const collection: TCollection = {
		...data[0],
		author: data[0].author?.name || 'Unknown'
	};

	setHeaders(getHeaders('collection'));
	redis.set(redisKey, JSON.stringify(collection), 'EX', getExpiration('collection'));
	return new Response(
		JSON.stringify({
			data: collection
		}),
		{ status }
	);
};

export const PUT: RequestHandler = async ({
	setHeaders,
	request,
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const { name, isPublic, color } = await request.json();

	try {
		collectionSchema.parse({ name, isPublic, color });
	} catch (e: unknown) {
		const error = e as ZodError;
		if (error.errors[0]?.message)
			return new Response(JSON.stringify({ error: error.errors[0].message }), { status: 422 });
	}

	const query = supabase
		.from('collections')
		.update({ name, is_public: isPublic, color })
		.match({ uid: collectionUid });

	const { error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(JSON.stringify({ error }), { status });

	const redisKey = `collection:${collectionUid}`;
	const cached = await redis.get(redisKey);
	if (cached) {
		redis.set(
			redisKey,
			JSON.stringify({ ...JSON.parse(cached), name, is_public: isPublic }),
			'EX',
			getExpiration('collection')
		);
		setHeaders({ 'Cache-Control': 'max-age=0' });
	}

	return new Response(null, { status });
};

export const DELETE: RequestHandler = async ({
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const query = supabase.from('collections').delete().match({ uid: collectionUid });
	const { error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(JSON.stringify({ error }), { status });

	const redisKey = `collection:${collectionUid}`;
	const redisKeys = (await redis.scan(0, 'MATCH', `collection:${collectionUid}:*`))[1];
	redis.del([redisKey, ...redisKeys]);

	return new Response(null, { status });
};
