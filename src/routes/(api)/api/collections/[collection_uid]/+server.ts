import { collectionSchema } from '$lib/schemas/collection_schema';
import { getExpiration, getHeaders } from '$server/cache';
import { checkUid } from '$server/helper';
import { redis } from '$server/redis';
import type { RequestHandler } from '@sveltejs/kit';

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
		.from('cards_collections')
		.select('uid, author:profiles(name:name), name, is_public, created_at')
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
	request,
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const body = await request.json();

	const isValid = collectionSchema.parse(body);
	console.log(isValid);

	if (!isValid)
		return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 422 });

	const query = supabase
		.from('cards_collections')
		.update({ ...body })
		.match({ uid: collectionUid });

	const { error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(JSON.stringify({ error }), { status });

	const redisKey = `collection:${collectionUid}`;
	redis.set(redisKey, 'EX', getExpiration('collection'));

	// TODO: UPDATE REDIS COLLECTION

	return new Response(null, { status });
};
