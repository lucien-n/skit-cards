import type { Database } from '$lib/types/database.types';
import type { Flashcard } from '$lib/types/flashcard.type';
import type { Profile, PublicProfile } from '$lib/types/profile.type';
import { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	type TProfile = Profile;
	type TPublicProfile = PublicProfile;
	type TFlashcard = Flashcard;

	type TSupaProfile = Tables<'profiles'>;
	type TSupaFlashcard = Tables<'cards'>;
	type TSupaCollection = Tables<'cards-collections'>;

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
