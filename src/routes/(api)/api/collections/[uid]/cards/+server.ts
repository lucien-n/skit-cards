import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { uid }, locals: { supabase } }) => {
	if (!uid || uid.length !== 36) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards')
		.select('uid, collection, question, answer')
		.match({ collection: uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	if (data satisfies TFlashcard[]) return new Response(JSON.stringify({ data }), { status });

	return new Response();
};

export const PUT: RequestHandler = async ({
	request,
	params: { uid: collection_uid },
	locals: { supabase }
}) => {
	if (!collection_uid || collection_uid.length !== 36) return new Response(null, { status: 422 });

	const { question, answer, uid } = await request.json();

	if (!uid || uid.length !== 36)
		return new Response(JSON.stringify({ error: 'Please provide a valid uid' }), { status: 422 });

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
		.match({ collection: collection_uid, uid });

	const { status }: DbResult<typeof query> = await query;

	return new Response(null, { status });
};

export const POST: RequestHandler = async ({
	request,
	params: { uid: collection_uid },
	locals: { supabase }
}) => {
	if (!collection_uid || collection_uid.length !== 36) return new Response(null, { status: 422 });

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
		.insert({ collection: collection_uid, question, answer })
		.select('uid');

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status });

	if (!data || !(data.length > 0)) return new Response(null, { status });

	const { uid } = data[0];

	return new Response(JSON.stringify({ data: uid }), { status });
};
