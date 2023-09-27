import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { uid }, locals: { session, supabase } }) => {
	if (!uid || uid.length !== 36) return new Response(null, { status: 422 });

	// const query = supabase.from('cards').select('uid, author, name, created_at').match({ collection: uid });

	return new Response();
};
