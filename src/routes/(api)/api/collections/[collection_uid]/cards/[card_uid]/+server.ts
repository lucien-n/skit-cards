import { checkUid } from '$server/helper';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({
	params: { collection_uid, card_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;
	const { uid: cardUid, response: cardResponse } = checkUid(card_uid);
	if (cardResponse) return cardResponse;

	const query = supabase
		.from('cards')
		.select('question, answer')
		.match({ collection: collection_uid, uid: card_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if ({ ...data[0], collection: collectionUid, uid: cardUid } satisfies TFlashcard)
		return new Response(JSON.stringify({ data }), { status });

	return new Response();
};

export const PUT: RequestHandler = async ({
	request,
	params: { collection_uid, card_uid },
	locals: { supabase }
}) => {
	const { uid: collectionUid, response: collectionResponse } = checkUid(collection_uid);
	if (collectionResponse) return collectionResponse;
	const { uid: cardUid, response: cardResponse } = checkUid(card_uid);
	if (cardResponse) return cardResponse;

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

	const query = supabase
		.from('cards')
		.update({ question, answer })
		.match({ collection: collectionUid, uid: cardUid });

	const { status }: DbResult<typeof query> = await query;

	return new Response(null, { status });
};
