import type { Profile, PublicProfile } from '$lib/types/profile.type';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

declare global {
	type TProfile = Profile;
	type TPublicProfile = PublicProfile;

	type TSupaProfile = Tables<'profiles'>;

	type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
	type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
	type DbResultErr = PostgrestError;

	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
	}
}
