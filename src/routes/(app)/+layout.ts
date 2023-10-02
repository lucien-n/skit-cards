import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { cfetch } from '$lib/cfetch';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load = async ({ fetch, data, depends, url: { pathname } }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	let profile: TPublicProfile | null = null;
	if (session) {
		const { data, error } = await cfetch<TPublicProfile>(
			`/api/users/${session?.user.id}/profile`,
			'GET',
			fetch
		);
		if (data || !error) profile = data;
	}

	return { supabase, session, profile, url: pathname };
};
