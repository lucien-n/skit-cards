import { cfetch, type Fetch } from '$lib/cfetch';
import { writable, type Invalidator, type Subscriber } from 'svelte/store';

type ProfileStore = {
	subscribe: (
		this: void,
		run: Subscriber<TPublicProfile | null>,
		invalidate?: Invalidator<TPublicProfile | null>
	) => () => void;
	set: (value: TPublicProfile | null) => void;
	update: (updater: (value: TPublicProfile | null) => TPublicProfile | null) => void;
	refresh: (fetch: Fetch, uid?: string) => void;
};

const createProfileStore = (): ProfileStore => {
	const { subscribe, set, update } = writable<TPublicProfile | null>(null);

	const refresh = async (fetch: Fetch, uid?: string) => {
		update((currentPublicProfile: TPublicProfile | null) => {
			if (!currentPublicProfile && !uid) return null;

			const fetchProfile = async () => {
				const { data, error } = await cfetch(`/api/users/${uid}/profile`, 'GET', fetch);
				if (error) {
					console.warn(error);
					return;
				}

				const newProfile = data[0] as TPublicProfile;
				set(newProfile);
			};
			if (uid) fetchProfile();

			return currentPublicProfile;
		});
	};

	return {
		subscribe,
		set,
		update,
		refresh
	};
};

const profileStore: ProfileStore = createProfileStore();

export default profileStore;
