import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({
	params: { collection_uid, card_uid },
	locals: { supabase }
}) => {
	if (!collection_uid || collection_uid.length !== 36) return new Response(null, { status: 422 });
	if (!card_uid || card_uid.length !== 36) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards')
		.select('question, answer')
		.match({ collection: collection_uid, uid: card_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if ({ ...data[0], collection: collection_uid, uid: card_uid } satisfies TFlashcard)
		return new Response(JSON.stringify({ data }), { status });

	return new Response();
};
