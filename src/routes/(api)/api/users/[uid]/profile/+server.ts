import { getExpiration, getHeaders } from '$server/cache';
import { redis } from '$server/redis';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

const getCachedProfile = async (
	uid?: string,
	name?: string
): Promise<{ profile?: TProfile; ttl?: number; status: number }> => {
	const redisKeyPattern = `profile:${uid ? uid + '|*' : '*|' + name}`;
	const redisKeys = (await redis.scan(0, 'MATCH', redisKeyPattern))[1];
	const cached = await redis.get(redisKeys[0]);

	if (cached) {
		const ttl = await redis.ttl(redisKeys[0]);
		const profile = JSON.parse(cached);
		return { profile, ttl, status: 200 };
	}

	return { status: 404 };
};

const getProfile = async (supabase: SupabaseClient, uid?: string, name?: string) => {
	const query = supabase
		.from('profiles')
		.select('uid, name, avatar_url, created_at')
		.match(uid ? { uid } : { name });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return { status };

	if (!data?.[0]) return { status };

	const profile_data = data[0];

	const profile = {
		uid: profile_data.uid,
		name: profile_data.name,
		avatar_url: profile_data.avatar_url || ''
	} satisfies TPublicProfile;

	return { profile, status };
};

export const GET: RequestHandler = async ({ params, setHeaders, locals: { supabase } }) => {
	const uid_or_username = params.uid as string;

	let uid = '';
	let name = '';

	if (uid_or_username.length === 36) uid = uid_or_username;
	else name = uid_or_username;

	const { profile: cachedProfile, ttl, status: cachedStatus } = await getCachedProfile(uid, name);
	if (cachedProfile) {
		setHeaders({ 'Cache-Control': `max-age=${ttl}` });
		return new Response(JSON.stringify({ data: cachedProfile }), { status: cachedStatus });
	}

	const { profile, status } = await getProfile(supabase, uid, name);

	if (!profile || status !== 200) return new Response(null, { status });

	setHeaders(getHeaders('profile'));
	redis.set(
		`profile:${profile.uid + '|' + profile.name}`,
		JSON.stringify(profile),
		'EX',
		getExpiration('profile')
	);

	return new Response(JSON.stringify({ data: profile }), { status: 200 });
};
