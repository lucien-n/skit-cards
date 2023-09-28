import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals: { supabase } }) => {
	const uid_or_username = params.uid as string;

	let uid = '';
	let name = '';

	if (uid_or_username.length === 36) uid = uid_or_username;
	else name = uid_or_username;

	const query = supabase
		.from('profiles')
		.select('uid, name, avatar_url, created_at')
		.match(uid ? { uid } : { name });

	const { data, error }: DbResult<typeof query> = await query;

	if (error)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
	if (!data?.[0]) return new Response(null, { status: 204 });

	const profile_data = data?.[0];

	const profile = {
		uid: profile_data.uid,
		name: profile_data.name,
		avatar_url: profile_data.avatar_url || ''
	} satisfies TPublicProfile;

	return new Response(JSON.stringify({ data: profile }), { status: 200 });
};
