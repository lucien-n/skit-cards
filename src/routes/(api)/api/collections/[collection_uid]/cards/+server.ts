import { checkUid } from '$server/helper';
import { redis } from '$server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const GET: RequestHandler = async ({
	setHeaders,
	url: { searchParams },
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const fetchSingle = searchParams.has('uid');
	const card_uid: string | null = searchParams.get('uid');

	const { uid: cardUid, response: cardResponse } = checkUid(card_uid);
	if (fetchSingle && cardResponse) return cardResponse;

	if (fetchSingle) {
		const redisKey = `collection:${collectionUid}:card:${cardUid}`;
		const cached = await redis.get(redisKey);
		if (cached) {
			const ttl = await redis.ttl(redisKey);
			setHeaders({ 'Cache-Control': `max-age=${ttl}` });
			return new Response(JSON.stringify({ data: JSON.parse(cached) }), { status: 200 });
		}
	}

	const query = supabase
		.from('cards')
		.select('uid, collection, question, answer')
		.match({
			collection: collectionUid,
			...(fetchSingle ? { uid: cardUid } : {})
		});

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	const cards: TFlashcard[] = [];

	for (const cardData of data) {
		cards.push(cardData);
	}

	if (fetchSingle) return new Response(JSON.stringify({ data: cards[0] }), { status });
	else return new Response(JSON.stringify({ data: cards }), { status });
};

export const POST: RequestHandler = async ({
	request,
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const { question, answer } = await request.json();

	if (!question || question.length < 3 || question.length > 255)
		return new Response(
			JSON.stringify({ error: 'Please provide a valid question (3 <= length <= 255)' }),
			{ status: 422 }
		);
	if (!answer || answer.length < 3 || answer.length > 255)
		return new Response(
			JSON.stringify({ error: 'Please provide a valid answer (3 <= length <= 255)' }),
			{ status: 422 }
		);

	const id = nanoid();
	const query = supabase
		.from('cards')
		.insert({ uid: id, collection: collectionUid, question, answer })
		.select('uid');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status });

	const { uid } = data[0];

	return new Response(JSON.stringify({ data: uid }), { status });
};
