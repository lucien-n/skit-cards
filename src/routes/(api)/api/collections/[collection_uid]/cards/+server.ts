import { cardSchema } from '$lib/schemas/card_schema';
import { getExpiration } from '$server/cache';
import { checkUid } from '$server/helper';
import { redis } from '$server/redis';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { ZodError } from 'zod';

const getCollectionLength = async (collectionUid: string): Promise<number> => {
	const cachedCollection = await redis.get(`collection:${collectionUid}`);
	if (cachedCollection) {
		const collection = JSON.parse(cachedCollection);
		return collection.length;
	}

	return 0;
};

const getCachedCards = async (collectionUid: string): Promise<TFlashcard[]> => {
	const redisKeys = (await redis.scan(0, 'MATCH', `collection:${collectionUid}:*`))[1];
	if (!(redisKeys.length > 0)) return [];

	const cached = await redis.mget(redisKeys);

	const cards: TFlashcard[] = [];

	if (cached.length > 0) {
		for (const cachedCard of cached) {
			if (!cachedCard) continue;
			const card = JSON.parse(cachedCard);
			if (card satisfies TFlashcard) cards.push(card);
		}
	}

	return cards;
};

const getCachedCard = async (key: string): Promise<{ card?: TFlashcard; ttl?: number }> => {
	const cached = await redis.get(key);
	if (cached) {
		const ttl = await redis.ttl(key);
		const card = JSON.parse(cached);
		return { card, ttl };
	}

	return {};
};

const getCards = async (
	collectionUid: string,
	supabase: SupabaseClient
): Promise<{ cards?: TFlashcard[]; status: number }> => {
	const cachedCards = await getCachedCards(collectionUid);

	if (cachedCards.length > 0 && cachedCards.length == (await getCollectionLength(collectionUid))) {
		return { cards: cachedCards, status: 200 };
	}

	const alreadyFetchedUids = cachedCards.map((card) => card.uid);

	const query = supabase
		.from('cards')
		.select('uid, question, answer, created_at')
		.match({ collection: collectionUid })
		.not('uid', 'in', `(${alreadyFetchedUids})`);

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error || status !== 200) return { status };

	const fetchedCards: TFlashcard[] = [];

	for (const fetchedCard of data) {
		const card = { ...fetchedCard, collection: collectionUid };
		if (card satisfies TFlashcard) fetchedCards.push(card);
	}

	for (const fetchedcard of fetchedCards) {
		redis.set(
			`collection:${collectionUid}:${fetchedcard.uid}`,
			JSON.stringify(fetchedcard),
			'EX',
			getExpiration('card')
		);
	}

	const cards = [...cachedCards, ...fetchedCards].sort(
		(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	);

	return { cards, status };
};

const getCard = async (
	collectionUid: string,
	cardUid: string,
	supabase: SupabaseClient
): Promise<{ card?: TFlashcard; status: number }> => {
	const cachedCard = await getCachedCard(`collection:${collectionUid}:${cardUid}`);

	if (cachedCard) return new Response(JSON.stringify({ data: cachedCard }), { status: 200 });

	const query = supabase
		.from('cards')
		.select('uid, question, answer, created_at')
		.match({ collection: collectionUid, uid: cardUid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error || status !== 200) return { status };

	if (!data || !(data.length > 0)) return { status: 204 };

	const card: TFlashcard = {
		...data[0],
		collection: collectionUid
	};

	return { card, status };
};

export const GET: RequestHandler = async ({
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
		const { card, status } = await getCard(collectionUid, cardUid, supabase);
		return new Response(card ? JSON.stringify({ data: card }) : null, { status });
	} else {
		const { cards, status } = await getCards(collectionUid, supabase);
		return new Response(cards ? JSON.stringify({ data: cards }) : null, { status });
	}
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

	const card = {
		uid: id,
		collection: collectionUid,
		question,
		answer
	};

	const query = supabase.from('cards').insert(card).select('uid, created_at');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status });

	const { uid, created_at } = data[0];

	redis.set(
		`collection:${collectionUid}:${uid}`,
		JSON.stringify({ ...card, created_at }),
		'EX',
		getExpiration('card')
	);

	return new Response(JSON.stringify({ data: uid }), { status });
};

export const PUT: RequestHandler = async ({
	request,
	setHeaders,
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const { question, answer, uid } = await request.json();
	const { uid: cardUid, response: cardResponse } = checkUid(uid);
	if (cardResponse) return cardResponse;

	try {
		cardSchema.parse({ question, answer });
	} catch (e: unknown) {
		const error = e as ZodError;
		if (error.errors[0]?.message)
			return new Response(JSON.stringify({ error: error.errors[0].message }), { status: 422 });
	}

	const query = supabase
		.from('cards')
		.update({ question, answer })
		.match({ collection: collectionUid });

	const { error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(JSON.stringify({ error }), { status });

	const redisKey = `collection:${collectionUid}:${cardUid}`;
	const cached = await redis.get(redisKey);
	if (cached) {
		redis.set(
			redisKey,
			JSON.stringify({ ...JSON.parse(cached), question, answer }),
			'EX',
			getExpiration('card')
		);
		setHeaders({ 'Cache-Control': 'max-age=0' });
	}

	return new Response(null, { status });
};

export const DELETE: RequestHandler = async ({
	request,
	params: { collection_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;

	const { card_uid } = await request.json();
	const { uid: cardUid, response: cardResponse } = checkUid(card_uid);
	if (cardResponse) return cardResponse;

	const query = supabase.from('cards').delete().match({ collection: collectionUid, uid: cardUid });
	const { error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(JSON.stringify({ error }), { status });

	const redisKey = `collection:${collectionUid}:${cardUid}`;
	redis.del(redisKey);

	return new Response(null, { status });
};
